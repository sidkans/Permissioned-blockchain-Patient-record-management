import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext'; // Adjust path if needed
import AccessControl from '../components/AccessControl'; // Adjust path if needed
import RecordCard from '../components/RecordCard'; // Adjust path if needed
import Loading from '../components/Loading'; // Adjust path if needed
import '../styles/Dashboard.css'; // Adjust path if needed

function PatientDashboard() {
    const {
        currentAccount,
        userRole,
        addRecord,
        viewRecords,
        records, // Assuming 'records' state holds records fetched by viewRecords
        loading,
        error,
        // grantAccess, revokeAccess are likely handled within AccessControl component directly via context
    } = useContext(BlockchainContext);

    const [recordData, setRecordData] = useState(''); // Example state for adding a record
    const [fetchError, setFetchError] = useState('');

    // Fetch records when the component mounts or account changes
    useEffect(() => {
        if (currentAccount && userRole === 'patient') {
            viewRecords(currentAccount).catch(err => {
                console.error("Error fetching patient records:", err);
                setFetchError("Failed to fetch records.");
            });
        }
    }, [currentAccount, userRole, viewRecords]); // viewRecords added as dependency

    const handleAddRecord = async (e) => {
        e.preventDefault();
        if (!recordData) {
            alert("Record data cannot be empty");
            return;
        }
        // Basic validation - In real app, use proper forms and validation
        const recordJson = {
            details: recordData, // Structure your record data as needed
            date: new Date().toISOString(),
        };

        try {
            await addRecord(recordJson); // addRecord uploads to IPFS and calls contract
            setRecordData(''); // Clear input field
            // Optionally re-fetch records
            await viewRecords(currentAccount);
            alert('Record added successfully!');
        } catch (err) {
            console.error("Error in handleAddRecord:", err);
            alert(`Failed to add record: ${err.message || error}`); // Show specific error if available
        }
    };

    // Conditional Rendering based on Role and Connection
    if (!currentAccount) {
        return <div className="dashboard-container"><p>Please connect your wallet.</p></div>;
    }

    if (loading && !records.length) { // Show loading only if records aren't already displayed
        return <div className="dashboard-container"><Loading /></div>;
    }

    if (userRole === null && !loading) {
        // Still determining role or role not found
        return <div className="dashboard-container"><p>Verifying user role...</p></div>;
    }

    if (userRole !== 'patient') {
        return <div className="dashboard-container"><p>Access Denied. You do not have the required 'Patient' role.</p></div>;
    }

    // --- Render Patient Dashboard UI ---
    return (
        <div className="dashboard-container patient-dashboard">
            <h2>Patient Dashboard</h2>
            <p>Welcome, {currentAccount}</p>
            {error && <p className="error-message">Error: {error}</p>}
            {fetchError && <p className="error-message">Error: {fetchError}</p>}

            {/* Section to Add New Record */}
            <div className="dashboard-section">
                <h3>Add New Medical Record</h3>
                <form onSubmit={handleAddRecord} className="record-form">
                    <textarea
                        value={recordData}
                        onChange={(e) => setRecordData(e.target.value)}
                        placeholder="Enter record details..."
                        rows="4"
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Record'}
                    </button>
                </form>
            </div>

            {/* Section to View Records */}
            <div className="dashboard-section">
                <h3>Your Medical Records</h3>
                {loading && records.length === 0 && <p>Loading records...</p>}
                {!loading && records.length === 0 && <p>No records found.</p>}
                <div className="records-grid">
                    {records.map((record, index) => (
                        // Assuming record structure from contract is { ipfsHash, timestamp, recordedBy }
                        <RecordCard key={index} ipfsHash={record.ipfsHash} timestamp={record.timestamp} />
                    ))}
                </div>
            </div>

            {/* Section for Access Control */}
            <div className="dashboard-section">
                <h3>Manage Doctor Access</h3>
                {/* AccessControl component likely fetches context itself */}
                <AccessControl />
            </div>
        </div>
    );
}

export default PatientDashboard;
