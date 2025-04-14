const { create } = require('ipfs-http-client');

const ipfs = create({ url: "https://ipfs.infura.io:5001/api/v0" });

async function uploadFile(fileBuffer) {
    const result = await ipfs.add(fileBuffer);
    console.log("IPFS Hash:", result.path);
}
