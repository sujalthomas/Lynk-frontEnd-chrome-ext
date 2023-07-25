import React, { useState, useRef, useEffect } from 'react';

const DownloadButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // References to specific elements in the DOM.
  const headerRef = useRef<HTMLElement | null>(null);
  const jobBodyRef = useRef<HTMLElement | null>(null);
  const employerRef = useRef<HTMLElement | null>(null);

  // Initialize references on component mount.
  useEffect(() => {
    headerRef.current = document.querySelector('.p5');
    jobBodyRef.current = document.querySelector('.jobs-description__content #job-details');
    employerRef.current = document.querySelector('.artdeco-card .jobs-poster__name');
  }, []);

  /**
   * Utility function to extract text from given HTML string 
   * after cleaning up unnecessary elements.
   */
  function extractTextFromHtml(cleanedJobListingElem: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanedJobListingElem;

    // Remove all SVG and anchor elements for cleaner text extraction.
    Array.from(tempDiv.querySelectorAll("svg, a")).forEach(el => el.remove());

    return tempDiv.textContent || tempDiv.innerText || "";
  }

  /**
   * Handles the process of extracting data and sending it to the server.
   */
  const handleDownload = async () => {
    if (headerRef.current && jobBodyRef.current) {
      const headerElem = headerRef.current.outerHTML.trim();
      const jobBodyElem = jobBodyRef.current.innerHTML.trim();
      const jobListingElem = `${headerElem}${jobBodyElem}`;

      const cleanedJobListingElem = jobListingElem.replace(/>\s+</g, '><'); // Remove white spaces between tags.

      // Extract text content from cleaned HTML.
      const textContent = extractTextFromHtml(cleanedJobListingElem);

      // Extract company name, recruiter and the current date.
      let companyName = document.querySelector('.jobs-unified-top-card__primary-description .app-aware-link')?.textContent?.trim() || '';
      let recruiter = (document.querySelector('.artdeco-card .jobs-poster__name') as HTMLElement)?.innerText.trim() || "";
      const date = new Date().toLocaleDateString();

      // Check if the extracted fields are empty and replace them with default values if they are.
      companyName = companyName !== '' ? companyName : 'Company';
      recruiter = recruiter !== '' ? recruiter : 'Recruiter';

      // Organize extracted data.
      const postData = {
        "Company-name": companyName,
        "Job-Listing": textContent,
        "Recruiter": recruiter,
        "Date": date
      };

      try {
        const response = await fetch('http://127.0.0.1:3000/generate-cover-letter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = '';
        document.body.appendChild(a); // Required for Firefox.
        a.click();
        a.remove(); // Cleanup after download.


      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Toggle button state and initiate the download process.
  const handleClick = () => {
    setIsExpanded(!isExpanded);
    handleDownload();
  };

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
