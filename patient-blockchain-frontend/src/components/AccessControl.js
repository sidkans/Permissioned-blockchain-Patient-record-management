"use client"

import { useState, useContext } from "react"
import { BlockchainContext } from "../context/BlockchainContext"
import Loading from "./Loading"

const AccessControl = () => {
  const [doctorAddress, setDoctorAddress] = useState("")
  const [accessList, setAccessList] = useState([])
  const { grantAccess, revokeAccess, loading } = useContext(BlockchainContext)

  const handleGrantAccess = async (e) => {
    e.preventDefault()
    if (!doctorAddress) return

    const success = await grantAccess(doctorAddress)
    if (success) {
      setAccessList([...accessList, doctorAddress])
      setDoctorAddress("")
    }
  }

  const handleRevokeAccess = async (address) => {
    const success = await revokeAccess(address)
    if (success) {
      setAccessList(accessList.filter((a) => a !== address))
    }
  }

  if (loading) return <Loading />

  return (
    <div className="access-control">
      <h2>Manage Access Control</h2>

      <form onSubmit={handleGrantAccess} className="grant-access-form">
        <div className="form-group">
          <label htmlFor="doctorAddress">Doctor's Ethereum Address</label>
          <input
            type="text"
            id="doctorAddress"
            className="form-control"
            value={doctorAddress}
            onChange={(e) => setDoctorAddress(e.target.value)}
            placeholder="0x..."
            required
          />
        </div>
        <button type="submit" className="btn">
          Grant Access
        </button>
      </form>

      <div className="access-list">
        <h3>Authorized Doctors</h3>
        {accessList.length === 0 ? (
          <p>No doctors have been granted access yet.</p>
        ) : (
          <ul>
            {accessList.map((address, index) => (
              <li key={index} className="access-item">
                <span>{address}</span>
                <button onClick={() => handleRevokeAccess(address)} className="btn btn-danger">
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AccessControl
