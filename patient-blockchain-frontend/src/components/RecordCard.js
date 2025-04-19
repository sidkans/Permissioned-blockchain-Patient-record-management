const RecordCard = ({ record, index }) => {
  return (
    <div className="card record-card">
      <h3>Record #{index + 1}</h3>
      <p>
        <strong>IPFS Hash:</strong> {record.ipfsHash}
      </p>
      <p>
        <strong>Date Added:</strong> {new Date(record.timestamp * 1000).toLocaleString()}
      </p>
      <div className="record-actions">
        <a
          href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          View Data
        </a>
      </div>
    </div>
  )
}

export default RecordCard
