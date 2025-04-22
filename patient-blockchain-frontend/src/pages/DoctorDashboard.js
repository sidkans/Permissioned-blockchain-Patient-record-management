import React, { useState, useContext, useCallback } from 'react';
import { BlockchainContext } from '../context/BlockchainContext'; // Adjust path if needed
import RecordCard from '../components/RecordCard'; // Adjust path if needed
import Loading from '../components/Loading'; // Adjust path if needed
import '../styles/Dashboard.css'; // Adjust path if needed

function DoctorDashboard() {
    const {
        currentAccount,
        userRole,
        viewRecords,
        checkAccess, // Function to check if doctor has access to a patient
        loading,
        error,
    } = useContext(BlockchainContext);

    const [searchAddress, setSearchAddress] = useState('');
    const [patientRecords, setPatientRecords] = useState([]);
    const [searchError, setSearchError] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);

    const handleSearch = useCallback(async (e) => {
        e.preventDefault();
        if (!searchAddress || !currentAccount) return;

        setSearchLoading(true);
        setPatientRecords([]);
        setSearchError('');
        setAccessDenied(false);

        try {
            // 1. Check if doctor has access granted by the patient
            const hasAccess = await checkAccess(searchAddress, currentAccount);

            if (hasAccess) {
                 // 2. If access granted, view the records
                const recordsResult = await viewRecords(searchAddress);
                setPatientRecords(recordsResult || []); // Ensure it's an array
                 if (!recordsResult || recordsResult.length === 0) {
                    setSearchError("No records found for this patient, or access issue.");
                }
            } else {
                setAccessDenied(true);
                setSearchError("Access denied by patient or patient not found.");
            }
        } catch (err) {
            console.error("Error searching records:", err);
            setSearchError(`Failed to search records: ${err.message || 'Unknown error'}`);
        } finally {
            setSearchLoading(false);
        }
    }, [searchAddress, currentAccount, checkAccess, viewRecords]); // Added dependencies

    // Conditional Rendering based on Role and Connection
    if (!currentAccount) {
        return <div className="dashboard-container"><p>Please connect your wallet.</p></div>;
    }

     if (loading && userRole === null) { // Show loading while role is being verified initially
        return <div className="dashboard-container"><Loading /></div>;
    }

    if (userRole === null && !loading) {
         // Still determining role or role not found
        return <div className="dashboard-container"><p>Verifying user role...</p></div>;
    }

    if (userRole !== 'doctor') {
        return <div className="dashboard-container"><p>Access Denied. You do not have the required 'Doctor' role.</p></div>;
    }

    // --- Render Doctor Dashboard UI ---
    return (
        <div className="dashboard-container doctor-dashboard">
            <h2>Doctor Dashboard</h2>
            <p>Welcome, {currentAccount}</p>
            {error && <p className="error-message">Context Error: {error}</p>}

            {/* Section to Search Patient Records */}
            <div className="dashboard-section">
                <h3>Search Patient Records</h3>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                        placeholder="Enter Patient Address"
                        required
                        className="address-input"
                    />
                    <button type="submit" disabled={searchLoading || !searchAddress}>
                        {searchLoading ? 'Searching...' : 'Search Records'}
                    </button>
                </form>
                {searchError && <p className="error-message">{searchError}</p>}
                {accessDenied && <p className="warning-message">You do not have permission to view this patient's records.</p>}
            </div>

             {/* Section to Display Searched Records */}
             {!accessDenied && patientRecords.length > 0 && (
                 <div className="dashboard-section">
                    <h3>Records for {searchAddress}</h3>
                    <div className="records-grid">
                        {patientRecords.map((record, index) => (
                            <RecordCard key={index} ipfsHash={record.ipfsHash} timestamp={record.timestamp} />
                        ))}
                    </div>
                </div>
             )}
              {!accessDenied && !searchLoading && patientRecords.length === 0 && searchAddress && !searchError && (
                 <div className="dashboard-section">
                    <p>No records found for {searchAddress}.</p>
                 </div>
                )}

        </div>
    );
}

export default DoctorDashboard;
