import React, { useState, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext'; // Adjust path if needed
import Loading from '../components/Loading'; // Adjust path if needed
import '../styles/Dashboard.css'; // Adjust path if needed

function AdminDashboard() {
    const {
        currentAccount,
        userRole,
        loading,
        error,
        addRole, // Function to add roles
        removeRole, // Function to remove roles
    } = useContext(BlockchainContext);

    // State variables for Assign Role form
    const [assignAddress, setAssignAddress] = useState('');
    const [assignRole, setAssignRole] = useState('');

    // State variables for Remove Role form
    const [removeAddress, setRemoveAddress] = useState('');
    const [removeSelectedRole, setRemoveSelectedRole] = useState('');

    // Handlers for adding and removing roles
    const handleAddRole = async (e) => {
        e.preventDefault();
        if (!assignRole || !assignAddress) {
            alert("Please select a role and enter an address.");
            return;
        }
        const success = await addRole(assignRole, assignAddress);
        if (success) {
            alert(`${assignRole} role assigned to ${assignAddress}`);
            setAssignAddress('');
            setAssignRole('');
        }
    };

    const handleRemoveRole = async (e) => {
        e.preventDefault();
        if (!removeSelectedRole || !removeAddress) {
            alert("Please select a role and enter an address.");
            return;
        }
        const success = await removeRole(removeSelectedRole, removeAddress);
        if (success) {
            alert(`${removeSelectedRole} role removed from ${removeAddress}`);
            setRemoveAddress('');
            setRemoveSelectedRole('');
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

    if (userRole !== 'admin') {
        return <div className="dashboard-container"><p>Access Denied. You do not have the required 'Admin' role.</p></div>;
    }

    // --- Render Admin Dashboard UI ---
    return (
        <div className="dashboard-container admin-dashboard">
            <h2>Admin Dashboard</h2>
            <p>Welcome, Admin {currentAccount}</p>
            {error && <p className="error-message">Error: {error}</p>}

            {/* Section for Admin Actions */}
            <div className="dashboard-section">
                <h3>Manage Roles</h3>

                {/* Form to Add Role */}
                <form onSubmit={handleAddRole} style={{ marginBottom: '1em' }}>
                    <h4>Assign Role</h4>
                    <input
                        type="text"
                        value={assignAddress}
                        onChange={(e) => setAssignAddress(e.target.value)}
                        placeholder="Enter Address"
                        required
                        className="address-input"
                    />
                    <select
                        value={assignRole}
                        onChange={(e) => setAssignRole(e.target.value)}
                        required
                        className="role-select"
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="doctor">Doctor</option>
                        <option value="patient">Patient</option>
                    </select>
                    <button type="submit" disabled={loading}>
                        {loading ? "Assigning..." : "Add Role"}
                    </button>
                </form>

                {/* Form to Remove Role */}
                <form onSubmit={handleRemoveRole}>
                    <h4>Remove Role</h4>
                    <input
                        type="text"
                        value={removeAddress}
                        onChange={(e) => setRemoveAddress(e.target.value)}
                        placeholder="Enter Address"
                        required
                        className="address-input"
                    />
                    <select
                        value={removeSelectedRole}
                        onChange={(e) => setRemoveSelectedRole(e.target.value)}
                        required
                        className="role-select"
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="doctor">Doctor</option>
                        <option value="patient">Patient</option>
                    </select>
                    <button type="submit" disabled={loading}>
                        {loading ? "Removing..." : "Remove Role"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminDashboard;
