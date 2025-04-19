import React, { useState } from 'react';
import '../styles/Dashboard.css';

const HospitalDashboard = () => {
  const [newUser, setNewUser] = useState({
    address: '',
    name: '',
    role: 'patient'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call a function to register the user on the blockchain
    console.log('Registering new user:', newUser);
    alert(`User registration simulated for ${newUser.name} as ${newUser.role}`);
    setNewUser({
      address: '',
      name: '',
      role: 'patient'
    });
  };

  return (
    <div className="dashboard hospital-dashboard">
      <h1>Hospital Dashboard</h1>

      <div className="dashboard-section">
        <h2>Register New User</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="address">Ethereum Address</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-control"
              value={newUser.address}
              onChange={handleInputChange}
              placeholder="0x..."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={newUser.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              className="form-control"
              value={newUser.role}
              onChange={handleInputChange}
              required
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <button type="submit" className="btn">Register User</button>
        </form>
      </div>

      <div className="dashboard-section">
        <h2>Verify Record Integrity</h2>
        <div className="verify-record-form">
          <div className="form-group">
            <label htmlFor="recordHash">Record IPFS Hash</label>
            <input
              type="text"
              id="recordHash"
              className="form-control"
              placeholder="QmXyz..."
            />
          </div>
          <button className="btn">Verify Record</button>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Hospital Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Patients</h3>
            <p className="stat-value">124</p>
          </div>
          <div className="stat-card">
            <h3>Total Doctors</h3>
            <p className="stat-value">18</p>
          </div>
          <div className="stat-card">
            <h3>Records Created</h3>
            <p className="stat-value">356</p>
          </div>
          <div className="stat-card">
            <h3>Active Today</h3>
            <p className="stat-value">42</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;