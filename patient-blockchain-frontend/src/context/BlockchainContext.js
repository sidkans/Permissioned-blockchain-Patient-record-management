"use client"

import { createContext, useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import axios from "axios"

// ABI for your smart contract
// You'll need to replace this with your actual contract ABI
// You can get this from your artifacts after compiling your contract
const CONTRACT_ABI = [
 
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AccessControlBadConfirmation",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "neededRole",
          "type": "bytes32"
        }
      ],
      "name": "AccessControlUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "doctor",
          "type": "address"
        }
      ],
      "name": "AccessGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "doctor",
          "type": "address"
        }
      ],
      "name": "AccessRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "recordedBy",
          "type": "address"
        }
      ],
      "name": "RecordAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGrantedEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevokedEvent",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "addAdmin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "addDoctor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "addHospital",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "addRecord",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_doctor",
          "type": "address"
        }
      ],
      "name": "grantAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_patient",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_doctor",
          "type": "address"
        }
      ],
      "name": "hasSpecificAccess",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isAdmin",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isDoctor",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isHospital",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isPatient",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "registerPatient",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "removeAdmin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "removeDoctor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "removeHospital",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "removePatient",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "callerConfirmation",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_doctor",
          "type": "address"
        }
      ],
      "name": "revokeAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_patient",
          "type": "address"
        }
      ],
      "name": "viewRecords",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "recordedBy",
              "type": "address"
            }
          ],
          "internalType": "struct PatientRecords.Record[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
   
]

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x4B73196D4FF16169539c6228B82466501e0241c3"

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
        //determineUserRole(account)
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
      //determineUserRole(accounts[0])
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

//  // For demo purposes, determine user role based on address
//  // In a real app, this would come from your contract or a database
//  const determineUserRole = (address) => {
//    // This is just a placeholder. In a real app, you would check the role from your contract
//    // or from a database. For now, we'll just assign roles based on the address.
//    const addressLower = address.toLowerCase()
//    const lastChar = addressLower.charAt(addressLower.length - 1)
//
//    if (["0", "1", "2", "3"].includes(lastChar)) {
//      setUserRole("patient")
//    } else if (["4", "5", "6"].includes(lastChar)) {
//      setUserRole("doctor")
//    } else if (["7", "8"].includes(lastChar)) {
//      setUserRole("hospital")
//    } else {
//      setUserRole("admin")
//    }
//  }

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
        //determineUserRole(accounts[0])
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
      }
    }
  }, [checkIfWalletIsConnected])


// Add this inside the BlockchainProvider component
const getUserRole = useCallback(async () => {
  if (contract && currentAccount) {
    try {
      setLoading(true); // Optional: show loading indicator
      // Check roles in a sensible order (e.g., Admin > Hospital > Doctor > Patient)
      if (await contract.isAdmin(currentAccount)) {
        setUserRole("admin");
      } else if (await contract.isHospital(currentAccount)) {
        setUserRole("hospital");
      } else if (await contract.isDoctor(currentAccount)) {
        setUserRole("doctor");
      } else if (await contract.isPatient(currentAccount)) {
        setUserRole("patient");
      } else {
        setUserRole(null); // Not registered or role removed
      }
      setLoading(false);
    } catch (err) {
      console.error("Error getting user role:", err);
      setError("Could not determine user role from contract.");
      setUserRole(null);
      setLoading(false);
    }
  } else {
    setUserRole(null); // No contract or account connected
  }
}, [contract, currentAccount]);

// Call getUserRole when account changes or contract is set up
useEffect(() => {
  if (contract && currentAccount) {
    getUserRole();
  }
}, [contract, currentAccount, getUserRole]); // Add getUserRole dependency

// Modify the existing useEffect for account changes:
useEffect(() => {
    checkIfWalletIsConnected(); // Keep this

    const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
            // We don't call determineUserRole anymore,
            // the other useEffect will trigger getUserRole based on currentAccount change
        } else {
            setCurrentAccount("");
            setUserRole(null); // Clear role if disconnected
        }
    };

    if (window.ethereum) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
        if (window.ethereum) {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
    };
}, [checkIfWalletIsConnected]); // Removed determineUserRole call here

// Example function to be added inside BlockchainProvider
const registerPatientByHospital = async (patientAddress) => {
    if (!contract || userRole !== 'hospital') {
        setError("Only hospitals can register patients.");
        return false;
    }
    try {
        setLoading(true);
        const tx = await contract.registerPatient(patientAddress);
        await tx.wait();
        setLoading(false);
        console.log(`Patient ${patientAddress} registered successfully.`);
        // Maybe refresh user list or show success message
        return true;
    } catch (err) {
        console.error("Error registering patient:", err);
        setError("Failed to register patient.");
        setLoading(false);
        return false;
    }
};

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
