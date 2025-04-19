"use client"

import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BlockchainContext } from "../context/BlockchainContext"
import Loading from "../components/Loading"
import "../styles/Login.css"

const Login = () => {
  const { connectWallet, currentAccount, loading, error, userRole } = useContext(BlockchainContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (currentAccount && userRole) {
      localStorage.setItem("userRole", userRole)
      navigate(`/${userRole}-dashboard`)
    }
  }, [currentAccount, userRole, navigate])

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Connect to MedChain</h1>
        <p>Please connect your Ethereum wallet to access the platform.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <Loading />
        ) : (
          <button onClick={connectWallet} className="btn btn-large">
            Connect with MetaMask
          </button>
        )}

        <div className="wallet-info">
          <h3>Why do I need a wallet?</h3>
          <p>
            MedChain uses blockchain technology to secure your medical records. Your Ethereum wallet serves as your
            secure digital identity on the platform.
          </p>
          <h3>Don't have MetaMask?</h3>
          <p>
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="metamask-link">
              Download MetaMask
            </a>
            to create your Ethereum wallet.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

