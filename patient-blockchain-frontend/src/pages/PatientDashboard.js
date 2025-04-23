import React, { useState, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import axios from 'axios'; // For Pinata API calls
import '../styles/Dashboard.css';

function PatientDashboard() {
    const {
        currentAccount,
        userRole,
        addRecord, // Function to store IPFS hash in the blockchain
        grantAccess,
        revokeAccess,
        loading,
        error,
    } = useContext(BlockchainContext);

    const [file, setFile] = useState(null); // State for file input
    const [ipfsHash, setIpfsHash] = useState(''); // State to store IPFS hash
    const [grantDoctorAddress, setGrantDoctorAddress] = useState(''); // State for grant access input
    const [revokeDoctorAddress, setRevokeDoctorAddress] = useState(''); // State for revoke access input

    // Handle file upload to Pinata
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        try {
            // Read the file content
            const reader = new FileReader();
            reader.onload = async () => {
                const fileContent = reader.result; // Get the file content as a string

                // Create FormData for the file
                const formData = new FormData();
                const blob = new Blob([fileContent], { type: 'text/plain' }); // Convert content to Blob
                formData.append('file', blob, file.name);

                // Add metadata for Pinata
                const metadata = JSON.stringify({
                    name: 'PatientRecord',
                    keyvalues: {
                        uploadedBy: currentAccount,
                    },
                });
                formData.append('pinataMetadata', metadata);

                // Add Pinata options
                const options = JSON.stringify({
                    cidVersion: 1,
                });
                formData.append('pinataOptions', options);

                // Upload file to Pinata
                const response = await axios.post(
                    'https://api.pinata.cloud/pinning/pinFileToIPFS',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
                            pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
                        },
                    }
                );

                const hash = response.data.IpfsHash; // Get the IPFS hash
                setIpfsHash(hash);
                alert(`File uploaded successfully! IPFS Hash: ${hash}`);

                // Call the smart contract function to store the hash
                await addRecord(hash);
                alert("Record added to the blockchain!");
                setFile(null); // Clear the file input
            };

            reader.readAsText(file); // Read the file as text
        } catch (err) {
            console.error("Error uploading file to Pinata:", err);
            alert("Failed to upload file.");
        }
    };

    // Handle granting access to a doctor
    const handleGrantAccess = async (e) => {
        e.preventDefault();
        if (!grantDoctorAddress) {
            alert("Please enter a doctor's address.");
            return;
        }

        try {
            await grantAccess(grantDoctorAddress);
            alert(`Access granted to doctor: ${grantDoctorAddress}`);
            setGrantDoctorAddress(''); // Clear the input field
        } catch (err) {
            console.error("Error granting access:", err);
            alert("Failed to grant access.");
        }
    };

    // Handle revoking access from a doctor
    const handleRevokeAccess = async (e) => {
        e.preventDefault();
        if (!revokeDoctorAddress) {
            alert("Please enter a doctor's address.");
            return;
        }

        try {
            await revokeAccess(revokeDoctorAddress);
            alert(`Access revoked from doctor: ${revokeDoctorAddress}`);
            setRevokeDoctorAddress(''); // Clear the input field
        } catch (err) {
            console.error("Error revoking access:", err);
            alert("Failed to revoke access.");
        }
    };

    // Conditional rendering based on user role and connection
    if (!currentAccount) {
        return <div className="dashboard-container"><p>Please connect your wallet.</p></div>;
    }

    if (userRole === null) {
        return <div className="dashboard-container"><p>Verifying user role...</p></div>;
    }

    if (userRole !== 'patient') {
        return <div className="dashboard-container"><p>Access Denied. You do not have the required 'Patient' role.</p></div>;
    }

    return (
        <div className="dashboard-container patient-dashboard">
            <h2>Patient Dashboard</h2>
            <p>Welcome, {currentAccount}</p>
            {error && <p className="error-message">Error: {error}</p>}

            {/* Section to Upload Medical Records */}
            <div className="dashboard-section">
                <h3>Upload Medical Record</h3>
                <form onSubmit={handleFileUpload}>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
                {ipfsHash && (
                    <p>
                        File uploaded to IPFS: 
                        <a
                            href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {ipfsHash}
                        </a>
                    </p>
                )}
            </div>

            {/* Section to Manage Doctor Access */}
            <div className="dashboard-section">
                <h3>Manage Doctor Access</h3>
                {/* Grant Access Form */}
                <form onSubmit={handleGrantAccess}>
                    <input
                        type="text"
                        id="doctor-address-grant"
                        name="doctorAddressGrant"
                        value={grantDoctorAddress}
                        onChange={(e) => setGrantDoctorAddress(e.target.value)}
                        placeholder="Enter Doctor's Address"
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Granting...' : 'Grant Access'}
                    </button>
                </form>

                {/* Revoke Access Form */}
                <form onSubmit={handleRevokeAccess}>
                    <input
                        type="text"
                        id="doctor-address-revoke"
                        name="doctorAddressRevoke"
                        value={revokeDoctorAddress}
                        onChange={(e) => setRevokeDoctorAddress(e.target.value)}
                        placeholder="Enter Doctor's Address"
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Revoking...' : 'Revoke Access'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PatientDashboard;