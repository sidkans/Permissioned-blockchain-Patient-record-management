require("dotenv").config();
const axios = require('axios');

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

// Example usage
async function main() {
  const patientData = {
    name: "Test Patient",
    age: 30,
    diagnosis: "Test Diagnosis",
    treatment: "Test Treatment"
  };
  
  try {
    const hash = await uploadToPinata(patientData);
    console.log("IPFS Hash:", hash);
    
    // Now you can store this hash on your smart contract
  } catch (error) {
    console.error(error);
  }
}

main();