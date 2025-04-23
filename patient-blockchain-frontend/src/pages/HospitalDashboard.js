import React, { useState, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext'; // Adjust path if needed
import Loading from '../components/Loading'; // Adjust path if needed
import '../styles/Dashboard.css'; // Adjust path if needed

function HospitalDashboard() {
    const {
        currentAccount,
        userRole,
        loading, // Use general loading state for now
        error,
        registerPatientByHospital // Assuming this function exists in context now
    } = useContext(BlockchainContext);

    const [patientAddress, setPatientAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Specific loading for form
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const handleRegisterPatient = async (e) => {
        e.preventDefault();
        if (!patientAddress || !registerPatientByHospital) return;

        setIsSubmitting(true);
        setFormError('');
        setFormSuccess('');

        try {
            const success = await registerPatientByHospital(patientAddress);
            if (success) {
                setFormSuccess(`Patient ${patientAddress} registered successfully!`);
                setPatientAddress(''); // Clear field on success
            } else {
                 // Error likely set in context function, but set a generic one here too
                setFormError(error || "Failed to register patient. Check contract interaction.");
            }
        } catch (err) {
            // Catch errors not caught by the context function
            console.error("Error in handleRegisterPatient:", err);
            setFormError(`Registration failed: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

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

    if (userRole !== 'hospital') {
        return <div className="dashboard-container"><p>Access Denied. You do not have the required 'Hospital' role.</p></div>;
    }

     // --- Render Hospital Dashboard UI ---
    return (
        <div className="dashboard-container hospital-dashboard">
            <h2>Hospital Dashboard</h2>
            <p>Welcome, {currentAccount}</p>
            {error && !formError && <p className="error-message">Context Error: {error}</p>} {/* Show context error if no form error */}

            {/* Section to Register New Patient */}
            <div className="dashboard-section">
                <h3>Register New Patient</h3>
                 {/* Check if the function is available in context */}
                {!registerPatientByHospital && <p className="error-message">Patient registration function not available in context.</p>}
                {registerPatientByHospital && (
                    <form onSubmit={handleRegisterPatient} className="registration-form">
                        <input
                            type="text"
                            value={patientAddress}
                            onChange={(e) => setPatientAddress(e.target.value)}
                            placeholder="Enter Patient Wallet Address"
                            required
                            className="address-input"
                        />
                        <button type="submit" disabled={isSubmitting || !patientAddress}>
                            {isSubmitting ? 'Registering...' : 'Register Patient'}
                        </button>
                        {formError && <p className="error-message">{formError}</p>}
                        {formSuccess && <p className="success-message">{formSuccess}</p>}
                    </form>
                )}
            </div>

             {/* Placeholder for other Hospital actions */}
             <div className="dashboard-section">
                 <h3>Other Hospital Actions</h3>
                 <p>(Placeholder: Add UI for verifying record integrity or managing doctors if implemented)</p>
                 {/* Add form/button for adding doctors here if implemented */}
             </div>

        </div>
    );
}

export default HospitalDashboard;
