"use client"

import { createContext, useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import axios from "axios"

// ABI for your smart contract
// You'll need to replace this with your actual contract ABI
// You can get this from your artifacts after compiling your contract
const CONTRACT_ABI = [
  "function addRecord(string memory _ipfsHash) public",
  "function viewRecords(address _patient) public view returns (Record[] memory)",
  "function grantAccess(address _doctor) public",
  "function revokeAccess(address _doctor) public",
  "function hasAccess(address _patient, address _doctor) public view returns (bool)",
]

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x34E45500Bf9CE5E1327921D0f5674C83e53Cefe5"

export const BlockchainContext = createContext()

export const BlockchainProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("")
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState(null) // 'patient', 'doctor', 'hospital', 'admin'
  const [records, setRecords] = useState([])

  // Check if wallet is connected
  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        setError("Please install MetaMask!")
        return
      }

      const accounts = await ethereum.request({ method: "eth_accounts" })

      if (accounts.length !== 0) {
        const account = accounts[0]
        setCurrentAccount(account)
        setupEventListener()

        // For demo purposes, we'll set a role based on the account
        // In a real app, this would come from your contract or a database
        determineUserRole(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.error(error)
      setError("Error connecting to wallet")
    }
  }, [])

  // Connect wallet
  const connectWallet = async () => {
    try {
      setLoading(true)
      const { ethereum } = window

      if (!ethereum) {
        setError("Please install MetaMask!")
        setLoading(false)
        return
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      setCurrentAccount(accounts[0])
      setupEventListener()

      // Determine user role
      determineUserRole(accounts[0])
      setLoading(false)
    } catch (error) {
      console.error(error)
      setError("Error connecting to wallet")
      setLoading(false)
    }
  }

  // Setup event listener
  const setupEventListener = useCallback(async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

        setProvider(provider)
        setSigner(signer)
        setContract(contract)
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  // For demo purposes, determine user role based on address
  // In a real app, this would come from your contract or a database
  const determineUserRole = (address) => {
    // This is just a placeholder. In a real app, you would check the role from your contract
    // or from a database. For now, we'll just assign roles based on the address.
    const addressLower = address.toLowerCase()
    const lastChar = addressLower.charAt(addressLower.length - 1)

    if (["0", "1", "2", "3"].includes(lastChar)) {
      setUserRole("patient")
    } else if (["4", "5", "6"].includes(lastChar)) {
      setUserRole("doctor")
    } else if (["7", "8"].includes(lastChar)) {
      setUserRole("hospital")
    } else {
      setUserRole("admin")
    }
  }

  // Add a medical record
  const addRecord = async (patientData) => {
    try {
      setLoading(true)

      // Upload to IPFS via Pinata
      const ipfsHash = await uploadToPinata(patientData)

      // Store hash in smart contract
      const tx = await contract.addRecord(ipfsHash)
      await tx.wait()

      setLoading(false)
      return ipfsHash
    } catch (error) {
      console.error(error)
      setError("Error adding record")
      setLoading(false)
      throw error
    }
  }

  // Upload to IPFS via Pinata
  const uploadToPinata = async (data) => {
    try {
      // In a real app, you would have a backend endpoint to handle this
      // to keep your Pinata API keys secure
      const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
        },
      })

      console.log("Upload successful!")
      return response.data.IpfsHash
    } catch (error) {
      console.error("Error uploading to Pinata:", error)
      throw error
    }
  }

  // View patient records
  const viewRecords = async (patientAddress) => {
    try {
      setLoading(true)
      const records = await contract.viewRecords(patientAddress || currentAccount)
      setRecords(records)
      setLoading(false)
      return records
    } catch (error) {
      console.error(error)
      setError("Error viewing records")
      setLoading(false)
      return []
    }
  }

  // Grant access to a doctor
  const grantAccess = async (doctorAddress) => {
    try {
      setLoading(true)
      const tx = await contract.grantAccess(doctorAddress)
      await tx.wait()
      setLoading(false)
      return true
    } catch (error) {
      console.error(error)
      setError("Error granting access")
      setLoading(false)
      return false
    }
  }

  // Revoke access from a doctor
  const revokeAccess = async (doctorAddress) => {
    try {
      setLoading(true)
      const tx = await contract.revokeAccess(doctorAddress)
      await tx.wait()
      setLoading(false)
      return true
    } catch (error) {
      console.error(error)
      setError("Error revoking access")
      setLoading(false)
      return false
    }
  }

  // Check if a doctor has access to a patient's records
  const checkAccess = async (patientAddress, doctorAddress) => {
    try {
      const hasAccess = await contract.hasAccess(patientAddress || currentAccount, doctorAddress)
      return hasAccess
    } catch (error) {
      console.error(error)
      return false
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()

    // Handle account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setCurrentAccount(accounts[0])
        determineUserRole(accounts[0])
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
      }
    }
  }, [checkIfWalletIsConnected])

  return (
    <BlockchainContext.Provider
      value={{
        connectWallet,
        currentAccount,
        loading,
        error,
        userRole,
        addRecord,
        viewRecords,
        grantAccess,
        revokeAccess,
        checkAccess,
        records,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  )
}
