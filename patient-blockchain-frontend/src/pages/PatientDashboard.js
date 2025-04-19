"use client"

import { useState, useEffect, useContext } from "react"
import { BlockchainContext } from "../context/BlockchainContext"
import RecordCard from "../components/RecordCard"
import AccessControl from "../components/AccessControl"
import Loading from "../components/Loading"
import "../styles/Dashboard.css"

const PatientDashboard = () => {
  const { currentAccount, addRecord, viewRecords, loading, records } = useContext(BlockchainContext)
  const [newRecord, setNewRecord] = useState({
    diagnosis: "",
    treatment: "",
    medications: "",
    notes: "",
  })
  const [activeTab, setActiveTab] = useState("records")

  useEffect(() => {
    if (currentAccount) {
      loadRecords()
    }
  }, [currentAccount])

  const loadRecords = async () => {
    await viewRecords(currentAccount)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewRecord({
      ...newRecord,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addRecord(newRecord)
      setNewRecord({
        diagnosis: "",
        treatment: "",
        medications: "",
        notes: "",
      })
      loadRecords()
    } catch (error) {
      console.error("Error adding record:", error)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="dashboard patient-dashboard">
      <h1>Patient Dashboard</h1>
      <p className="account-info">Connected Account: {currentAccount}</p>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "records" ? "active" : ""}`}
          onClick={() => setActiveTab("records")}
        >
          My Records
        </button>
        <button className={`tab-btn ${activeTab === "add" ? "active" : ""}`} onClick={() => setActiveTab("add")}>
          Add Record
        </button>
        <button className={`tab-btn ${activeTab === "access" ? "active" : ""}`} onClick={() => setActiveTab("access")}>
          Access Control
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "records" && (
          <div className="records-section">
            <h2>My Medical Records</h2>
            {records.length === 0 ? (
              <p>No records found. Add your first medical record.</p>
            ) : (
              <div className="records-grid">
                {records.map((record, index) => (
                  <RecordCard key={index} record={record} index={index} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "add" && (
          <div className="add-record-section">
            <h2>Add New Medical Record</h2>
            <form onSubmit={handleSubmit} className="add-record-form">
              <div className="form-group">
                <label htmlFor="diagnosis">Diagnosis</label>
                <input
                  type="text"
                  id="diagnosis"
                  name="diagnosis"
                  className="form-control"
                  value={newRecord.diagnosis}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="treatment">Treatment</label>
                <input
                  type="text"
                  id="treatment"
                  name="treatment"
                  className="form-control"
                  value={newRecord.treatment}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="medications">Medications</label>
                <input
                  type="text"
                  id="medications"
                  name="medications"
                  className="form-control"
                  value={newRecord.medications}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-control"
                  value={newRecord.notes}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Add Record
              </button>
            </form>
          </div>
        )}

        {activeTab === "access" && <AccessControl />}
      </div>
    </div>
  )
}

export default PatientDashboard

