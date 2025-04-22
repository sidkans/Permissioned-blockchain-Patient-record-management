// scripts/addrecords.js
const hre = require("hardhat");
const uploadFileToIPFS = require("./uploadtoIPFS");  // Fixed path

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const contractAddress = "0xfA65DE74938177d298A2D03a18A941149f858B5A";
  const PatientRecords = await hre.ethers.getContractAt("PatientRecords", contractAddress);

  const filePath = "C:/Users/Sarang/Project_1 - Load_Balanced_URL_Shortener.pdf"; // your file
  const ipfsHash = await uploadFileToIPFS(filePath);
  const description = "Blood test report from April 2025";

  const tx = await PatientRecords.connect(deployer).addRecord(ipfsHash, description);
  await tx.wait();

  console.log("Record added with IPFS hash:", ipfsHash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});