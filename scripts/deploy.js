const hre = require("hardhat");

async function main() {
  const PatientRecords = await hre.ethers.getContractFactory("PatientRecords"); // Contract name

  console.log("Deploying PatientRecords...");
  const patientRecords = await PatientRecords.deploy(); // Deploys contract

  await patientRecords.waitForDeployment(); // Wait for contract to be deployed properly

  console.log(`PatientRecords deployed to: ${await patientRecords.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
