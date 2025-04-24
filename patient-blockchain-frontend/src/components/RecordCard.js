import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecordCard = ({ record }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Debug log to see exactly what's being passed to RecordCard
  console.log("RecordCard received record:", JSON.stringify(record));

  // Add null check at the beginning
  if (!record) {
    return <div className="record-card">No record data available</div>;
  }
  
  // Handle case where record might be a string directly (just the hash)
  const ipfsHash = typeof record === 'string' 
    ? record 
    : (record.ipfsHash || record[0] || '');
    
  const timestamp = typeof record === 'object' && record.timestamp 
    ? new Date(Number(record.timestamp) * 1000).toLocaleString() 
    : 'N/A';
    
  const recordedBy = typeof record === 'object' && record.recordedBy 
    ? record.recordedBy 
    : 'N/A';
  
  // Function to fetch and display content from IPFS
  const fetchIpfsContent = async () => {
    if (!ipfsHash) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      setContent(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching IPFS content:", err);
      setError("Could not load record content");
      setLoading(false);
    }
  };

  return (
    <div className="record-card">
      <h3>Medical Record</h3>
      <p><strong>IPFS Hash:</strong> {ipfsHash || 'N/A'}</p>
      <p><strong>Date:</strong> {timestamp}</p>
      <p><strong>Recorded By:</strong> {recordedBy}</p>
      
      <div className="record-actions">
        <button 
          onClick={fetchIpfsContent}
          disabled={loading || !ipfsHash}
          className="button"
        >
          {loading ? 'Loading...' : 'View Content'}
        </button>
        
        <a
          href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="view-button"
        >
          View on IPFS Gateway
        </a>
      </div>
      
      {error && <p className="error">{error}</p>}
      
      {content && (
        <div className="record-content">
          <h4>Record Content</h4>
          <pre>{JSON.stringify(content, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RecordCard;
