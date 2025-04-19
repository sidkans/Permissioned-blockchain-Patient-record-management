const hre = require("hardhat");
require("dotenv").config();
const axios = require('axios');

// Function to upload data to IPFS via Pinata
async function uploadToPinata(data) {
  const apiKey = process.env.PINATA_API_KEY;
  const apiSecret = process.env.PINATA_API_SECRET;
  
  if (!apiKey || !apiSecret) {
    throw new Error("Pinata API keys not found in .env file");
  }
  
  try {
    console.log("Uploading to IPFS via Pinata...");
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': apiKey,
          'pinata_secret_api_key': apiSecret
        }
      }
    );
    
    console.log("Upload successful!");
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to Pinata:', error.message);
    throw error;
  }
}

// Function to test retrieving records
async function testRetrieveRecords(contractInstance, patientAddress) {
  console.log("Testing record retrieval...");
  
  try {
    // View records (this will work if called by the patient or an authorized doctor)
    const records = await contractInstance.viewRecords(patientAddress);
    console.log("Retrieved records:", records);
    
    if (records.length > 0) {
      console.log("IPFS Hash from contract:", records[0].ipfsHash);
      console.log("View the data at https://gateway.pinata.cloud/ipfs/" + records[0].ipfsHash);
    } else {
      console.log("No records found for this patient");
    }
  } catch (error) {
    console.error("Error retrieving records:", error.message);
  }
}

async function main() {
  const patientData = {
    name: "Test Patient",
    age: 30,
    diagnosis: "Test Diagnosis",
    treatment: "Test Treatment"
  };
  
  try {
    // Get contract address from deployment
    const contractAddress = "0x31ccdbaD6462182be40d35E3463defe32ec07A0F"; // Replace with your actual contract address
    
    // Connect to the deployed contract
    console.log("Connecting to contract at", contractAddress);
    const PatientRecords = await hre.ethers.getContractFactory("PatientRecords");
    const contract = await PatientRecords.attach(contractAddress);
    
    // Upload to IPFS and store hash
    const hash = await uploadToPinata(patientData);
    console.log("IPFS Hash:", hash);
    
    console.log("Storing hash in smart contract...");
    const tx = await contract.addRecord(hash);
    await tx.wait();
    console.log(`Record added to blockchain with tx hash: ${tx.hash}`);
    
    // Get the signer's address (your address)
    const [signer] = await hre.ethers.getSigners();
    const myAddress = await signer.getAddress();
    
    // Add after adding the record but before retrieving
    console.log("Granting access to my own address for testing...");
    const grantTx = await contract.grantAccess(myAddress);
    await grantTx.wait();
    
    // Test retrieving your own records
    await testRetrieveRecords(contract, myAddress);
    
    console.log("Testing complete!");
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });