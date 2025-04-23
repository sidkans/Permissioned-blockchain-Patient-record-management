"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { BlockchainContext } from "../context/BlockchainContext"
import "../styles/Home.css"

const Home = () => {
  const { currentAccount, connectWallet, userRole } = useContext(BlockchainContext)
  const navigate = useNavigate()

  const handleDashboardClick = () => {
    if (!userRole) {
      navigate("/login")
    } else {
      navigate(`/${userRole}-dashboard`)
    }
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Secure Patient Record Management on Blockchain</h1>
          <p>
            A decentralized, tamper-proof system where patients have full control over their medical records. Built on
            Ethereum for maximum security and transparency.
          </p>
          {currentAccount ? (
            <button onClick={handleDashboardClick} className="btn btn-large">
              Go to Dashboard
            </button>
          ) : (
            <button onClick={connectWallet} className="btn btn-large">
              Connect Wallet to Begin
            </button>
          )}
        </div>
      </section>

      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Storage</h3>
            <p>Your medical records are securely stored using IPFS and blockchain technology.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Role-Based Access</h3>
            <p>Control who can access your medical information with granular permissions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Easy Access</h3>
            <p>Access your records anytime, anywhere using your Ethereum wallet.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Transparent History</h3>
            <p>View a complete, immutable history of all access to your records.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connect Your Wallet</h3>
            <p>Use MetaMask or any Ethereum wallet to securely authenticate.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Upload Records</h3>
            <p>Add your medical records which are encrypted and stored on IPFS.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Manage Access</h3>
            <p>Grant or revoke access to healthcare providers as needed.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>View History</h3>
            <p>Track who has accessed your records and when.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

