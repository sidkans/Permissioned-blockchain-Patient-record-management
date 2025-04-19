"use client"

import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BlockchainContext } from "../context/BlockchainContext"
import "../styles/Navbar.css"

const Navbar = () => {
  const { currentAccount, connectWallet, userRole } = useContext(BlockchainContext)
  const [localUserRole, setLocalUserRole] = useState(localStorage.getItem("userRole"))
  const navigate = useNavigate()

  useEffect(() => {
    // Update local state when context changes
    if (userRole) {
      setLocalUserRole(userRole)
    }
  }, [userRole])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    setLocalUserRole(null)
    navigate("/")
    window.location.reload()
  }

  const getDashboardLink = () => {
    const role = localUserRole || userRole
    if (!role) return "/login"
    return `/${role}-dashboard`
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            MedChain
          </Link>
          <ul className="navbar-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            {currentAccount ? (
              <>
                <li>
                  <Link to={getDashboardLink()}>Dashboard</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-outline">
                    Logout
                  </button>
                </li>
                <li>
                  <span className="account-display">
                    {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                  </span>
                </li>
              </>
            ) : (
              <li>
                <button onClick={connectWallet} className="btn">
                  Connect Wallet
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

