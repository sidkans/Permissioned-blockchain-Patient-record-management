"use client"

import { useState } from "react"
import "../styles/Dashboard.css"

const AdminDashboard = () => {
  const [newAddress, setNewAddress] = useState("")
  const [newRole, setNewRole] = useState("patient")

  const handleAddUser = (e) => {
    e.preventDefault()
    // This would add a user to your contract
    console.log("Adding user:", newAddress, "with role:", newRole)
    setNewAddress("")
  }

  return (
    <div className="dashboard admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-section">
        <h2>User Management</h2>

        <form onSubmit={handleAddUser} className="add-user-form">
          <div className="form-group">
            <label htmlFor="newAddress">Ethereum Address</label>
            <input
              type="text"
              id="newAddress"
              className="form-control"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newRole">Role</label>
            <select id="newRole" className="form-control" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="hospital">Hospital</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn">
            Add User
          </button>
        </form>
      </div>

      <div className="dashboard-section">
        <h2>System Management</h2>
        <p>This dashboard is under development. More features coming soon.</p>
      </div>
    </div>
  )
}

export default AdminDashboard
