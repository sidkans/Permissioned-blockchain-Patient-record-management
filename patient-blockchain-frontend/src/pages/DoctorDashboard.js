"use client"

import { useState } from "react"
import Loading from "../components/Loading"
import "../styles/Dashboard.css"

const DoctorDashboard = () => {
  const [patientAddress, setPatientAddress] = useState("")
  const [patientRecords, setPatientRecords] = useState([])
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCheckAccess = async () => {
    if (!patientAddress) return

    setLoading(true)
    try {
      // This would be implemented with your actual contract
      // const hasAccess = await contract.checkAccess(patientAddress)
      const hasAccess = true // Placeholder
      setHasAccess(hasAccess)

      if (hasAccess) {
        // This would fetch records from your contract
        // const records = await contract.getPatientRecords(patientAddress)
        const records = [] // Placeholder
        setPatientRecords(records)
      }
    } catch (err) {
      console.error(err)
      setError("Error checking access")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="dashboard doctor-dashboard">
      <h1>Doctor Dashboard</h1>

      <div className="patient-lookup">
        <h2>Patient Record Access</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <label htmlFor="patientAddress">Patient Ethereum Address</label>
          <div className="address-input-group">
            <input
              type="text"
              id="patientAddress"
              className="form-control"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              placeholder="0x..."
            />
            <button onClick={handleCheckAccess} className="btn">
              Check Access
            </button>
          </div>
        </div>

        {patientAddress && (
          <div className="access-status">
            <p>
              Access Status:
              {hasAccess ? (
                <span className="access-granted">Granted</span>
              ) : (
                <span className="access-denied">Denied</span>
              )}
            </p>
          </div>
        )}

        {hasAccess && (
          <div className="patient-records">
            <h3>Patient Records</h3>
            {patientRecords.length === 0 ? (
              <p>No records found for this patient.</p>
            ) : (
              <div className="records-grid">{/* Map through patient records here */}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorDashboard

