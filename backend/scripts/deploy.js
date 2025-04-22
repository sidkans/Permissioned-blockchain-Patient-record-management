const hre = require("hardhat");

async function main() {
  const PatientRecords = await hre.ethers.getContractFactory("PatientRecords");

  console.log("Deploying PatientRecords to Sepolia...");
  const patientRecords = await PatientRecords.deploy();

  await patientRecords.waitForDeployment();
  
  const address = await patientRecords.getAddress();
  console.log(`PatientRecords deployed to: ${address}`);
  console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
