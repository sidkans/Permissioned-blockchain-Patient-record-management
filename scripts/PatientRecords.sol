// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PatientRecords {
    struct Record {
        string ipfsHash;
        address owner;
    }

    mapping(address => Record[]) private records;
    mapping(address => mapping(address => bool)) public accessControl;

    event RecordAdded(address indexed patient, string ipfsHash);
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);

    function addRecord(string memory _ipfsHash) public {
        records[msg.sender].push(Record(_ipfsHash, msg.sender));
        emit RecordAdded(msg.sender, _ipfsHash);
    }

    function grantAccess(address _doctor) public {
        accessControl[msg.sender][_doctor] = true;
        emit AccessGranted(msg.sender, _doctor);
    }

    function revokeAccess(address _doctor) public {
        accessControl[msg.sender][_doctor] = false;
        emit AccessRevoked(msg.sender, _doctor);
    }

    function viewRecords(
        address _patient
    ) public view returns (Record[] memory) {
        require(accessControl[_patient][msg.sender], "Access denied");
        return records[_patient];
    }
}
