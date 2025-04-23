// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol"; // Required for _msgSender()

// Define roles
bytes32 constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
bytes32 constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
bytes32 constant PATIENT_ROLE = keccak256("PATIENT_ROLE");
/**
 * @title PatientRecords contract with RBAC
 * @dev Manages patient records with role-based access control using OpenZeppelin AccessControl.
 */
contract PatientRecords is Context, AccessControl {

    struct Record {
        string ipfsHash;
        uint256 timestamp;
        address recordedBy; // Track who added the record (patient or authorized doctor)
    }

    // Mapping: patient address => array of their records
    mapping(address => Record[]) private patientRecords;

    // Mapping: patient address => doctor address => bool (true if doctor has access granted by patient)
    mapping(address => mapping(address => bool)) private specificDoctorAccess;

    // --- Events ---
    event RecordAdded(address indexed patient, string ipfsHash, address indexed recordedBy);
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);
    event RoleGrantedEvent(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevokedEvent(bytes32 indexed role, address indexed account, address indexed sender);


    constructor() {
        // Grant the deployer the default admin role and the specific admin role
        // The default admin role can grant/revoke all other roles
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(ADMIN_ROLE, _msgSender());
        emit RoleGrantedEvent(DEFAULT_ADMIN_ROLE, _msgSender(), _msgSender());
        emit RoleGrantedEvent(ADMIN_ROLE, _msgSender(), _msgSender());
    }

    // --- Role Management Functions (Admin only) ---

    function addAdmin(address account) public onlyRole(ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, account);
        emit RoleGrantedEvent(ADMIN_ROLE, account, _msgSender());
    }

    function removeAdmin(address account) public onlyRole(ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, account);
        emit RoleRevokedEvent(ADMIN_ROLE, account, _msgSender());
    }

    function addDoctor(address account) public onlyRole(ADMIN_ROLE) {
        // Consider if Hospitals should also be able to add doctors under them
        grantRole(DOCTOR_ROLE, account);
        emit RoleGrantedEvent(DOCTOR_ROLE, account, _msgSender());
    }

    function removeDoctor(address account) public onlyRole(ADMIN_ROLE) {
        revokeRole(DOCTOR_ROLE, account);
        emit RoleRevokedEvent(DOCTOR_ROLE, account, _msgSender());
    }

    function removePatient(address account) public onlyRole(ADMIN_ROLE) {
         // Only Admin should likely remove patients entirely
        revokeRole(PATIENT_ROLE, account);
        emit RoleRevokedEvent(PATIENT_ROLE, account, _msgSender());
        // Consider revoking doctor access related to this patient as well
    }


    // --- Record Management ---

    /**
     * @dev Allows a patient to add a record (IPFS hash) for themselves.
     * Requirement: Patient can upload encrypted medical records.
     * Note: Encryption must happen client-side before generating the hash.
     * Requirement: Doctor can add new medical records with patient consent. (NOT IMPLEMENTED - requires different logic)
     */
    function addRecord(string memory _ipfsHash) public onlyRole(PATIENT_ROLE) {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        patientRecords[_msgSender()].push(Record({
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            recordedBy: _msgSender() // Patient added this record
        }));
        emit RecordAdded(_msgSender(), _ipfsHash, _msgSender());
    }

    /**
     * @dev Allows a patient to view their own records, or an authorized doctor to view them.
     */
    function viewRecords(address _patient) public view returns (Record[] memory) {
        address caller = _msgSender();
        // Check if the caller is the patient themselves (and has PATIENT_ROLE)
        if (caller == _patient) {
             require(hasRole(PATIENT_ROLE, caller), "Caller is not a registered patient");
             return patientRecords[_patient];
        }
        // Check if the caller is a doctor (has DOCTOR_ROLE) AND has specific access granted by the patient
        else {
            require(hasRole(DOCTOR_ROLE, caller), "Caller is not a registered doctor");
            require(specificDoctorAccess[_patient][caller], "Doctor does not have access granted by this patient");
            return patientRecords[_patient];
        }
    }

    // --- Patient-Specific Access Control ---

    /**
     * @dev Allows a patient to grant a registered doctor access to their records.
     * Requirement: Patient can grant/revoke access to doctors.
     */
    function grantAccess(address _doctor) public onlyRole(PATIENT_ROLE) {
        require(hasRole(DOCTOR_ROLE, _doctor), "Target address is not a registered doctor");
        specificDoctorAccess[_msgSender()][_doctor] = true;
        emit AccessGranted(_msgSender(), _doctor);
    }

    /**
     * @dev Allows a patient to revoke access from a doctor.
     */
    function revokeAccess(address _doctor) public onlyRole(PATIENT_ROLE) {
        // No need to check if doctor has role here, just revoke
        specificDoctorAccess[_msgSender()][_doctor] = false;
        emit AccessRevoked(_msgSender(), _doctor);
    }

    /**
      * @dev Checks if a specific doctor has access granted by a specific patient.
      * Public view function for easier frontend checks if needed.
      */
    function hasSpecificAccess(address _patient, address _doctor) public view returns (bool) {
         // We implicitly check if _doctor has DOCTOR_ROLE when calling viewRecords,
         // but this function just checks the patient's explicit grant.
         return specificDoctorAccess[_patient][_doctor];
    }


    // --- Role Checking Functions (for frontend) ---

    function isAdmin(address account) public view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }

    function isDoctor(address account) public view returns (bool) {
        return hasRole(DOCTOR_ROLE, account);
    }

    function isPatient(address account) public view returns (bool) {
        return hasRole(PATIENT_ROLE, account);
    }

    // --- Other Utility Functions ---

    // Optional: Function to support interface detection
    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
