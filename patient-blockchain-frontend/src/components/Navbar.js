import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BlockchainContext } from '../context/BlockchainContext';

const Navbar = () => {
  const { currentAccount, connectWallet, userRole } = useContext(BlockchainContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
    window.location.reload();
  };

  const getDashboardLink = () => {
    if (!userRole) return '/login';
    return `/${userRole}-dashboard`;
  };

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
  );
};

export default Navbar;