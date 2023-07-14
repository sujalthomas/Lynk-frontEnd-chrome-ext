import React, { useState } from 'react';

const DownloadButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);

    // Select the job listing
    const jobListingElem = document.querySelector('.jobs-description__content #job-details'); 
    if (jobListingElem) {
      console.log(jobListingElem.textContent);
      // Use Fetch API to make a POST request to your server
      fetch('http://127.0.0.1:3000/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: jobListingElem.textContent }),
      })
      .then(response => response.json())
      .then(data => {
        // Use the returned file URL to trigger a download
        const a = document.createElement('a');
        a.href = data.fileUrl;
        a.download = 'coverLetter.docx';
        a.click();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }

  return (
    <div 
      onClick={handleClick} 
      style={{
        position: 'fixed',
        top: '50%',
        right: '0',
        transform: 'translateY(-50%)',
        backgroundColor: 'violet',
        width: isExpanded ? '250px' : '50px',
        height: '50px',
        borderRadius: '50%',
        zIndex: 9999,
        transition: 'width 0.3s',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {isExpanded && (
        <span style={{ color: 'white', marginRight: '10px' }}>Generate Cover Letter</span>
      )}
    </div>
  );
};

export default DownloadButton;
