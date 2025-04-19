"use client"

import { useState } from "react"
import "../styles/Dashboard.css"

const HospitalDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalRecords: 0,
  })

  return (
    <div className="dashboard hospital-dashboard">
      <h1>Hospital Dashboard</h1>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p className="stat-number">{stats.totalPatients}</p>
        </div>
        <div className="stat-card">
          <h3>Total Doctors</h3>
          <p className="stat-number">{stats.totalDoctors}</p>
        </div>
        <div className="stat-card">
          <h3>Total Records</h3>
          <p className="stat-number">{stats.totalRecords}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Hospital Management</h2>
        <p>This dashboard is under development. More features coming soon.</p>
      </div>
    </div>
  )
}

export default HospitalDashboard
