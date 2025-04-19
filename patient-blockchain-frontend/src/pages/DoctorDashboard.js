import React, { useState, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import RecordCard from '../components/RecordCard';
import Loading from '../components/Loading';
import '../styles/Dashboard.css';

const DoctorDashboard = () => {
  const { currentAccount, viewRecords, loading, records } = useContext(BlockchainContext);
  const [patientAddress, setPatientAddress] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!patientAddress) return;
    
    await viewRecords(patientAddress);
    setHasSearched(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="dashboard doctor-dashboard">
      <h1>Doctor Dashboard</h1>
      <p className="account-info">Connected Account: {currentAccount}</p>

      <div className="patient-search-section">
        <h2>Access Patient Records</h2>
        <form onSubmit={handleSearch} className="patient-search-form">
          <div className="form-group">
            <label htmlFor="patientAddress">Patient's Ethereum Address</label>
            <input
              type="text"
              id="patientAddress"
              className="form-control"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
          <button type="submit" className="btn">Search Records</button>
        </form>
      </div>

      {hasSearched && (
        <div className="records-section">
          <h2>Patient Records</h2>
          {records.length === 0 ? (
            <div className="alert alert-danger">
              No records found for this patient or you don't have access.
            </div>
          ) : (
            <div className="records-grid">
              {records.map((record, index) => (
                <RecordCard key={index} record={record} index={index} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="recent-patients-section">
        <h2>Recent Patients</h2>
        <p>Your recently accessed patients will appear here.</p>
        {/* This would be populated from a local storage or database in a real app */}
        <div className="no-patients-message">
          No recent patients.
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;