import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

const DownloadButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const jobBodyRef = useRef<HTMLElement | null>(null);
  const employerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    headerRef.current = document.querySelector('.p5');
    jobBodyRef.current = document.querySelector('.jobs-description__content #job-details');
    employerRef.current = document.querySelector('.artdeco-card .jobs-poster__name');
  }, []);

  function sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html);
  }

  function getDefaultIfEmpty(value: string, defaultValue: string): string {
    return value !== '' ? value : defaultValue;
  }

  function extractTextFromHtml(cleanedJobListingElem: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanedJobListingElem;
    Array.from(tempDiv.querySelectorAll("svg, a")).forEach(el => el.remove());
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  const handleDownload = async () => {
    setIsLoading(true);

    // Promisified version of chrome.storage.sync.get
    const getFromStorage = (key: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(result[key]);
          }
        });
      });
    };

    // Fetch token
    const token = await getFromStorage('token');
    // Fetch API key from chrome storage
    const storedApiKey = await getFromStorage('apiKey');

    if (!token) {
      console.error("Token not found in storage.");
      setIsLoading(false);
      return;
    }

    if (headerRef.current && jobBodyRef.current) {
      const headerElem = sanitizeHTML(headerRef.current.outerHTML.trim());
      const jobBodyElem = sanitizeHTML(jobBodyRef.current.innerHTML.trim());
      const jobListingElem = `${headerElem}${jobBodyElem}`;

      const cleanedJobListingElem = jobListingElem.replace(/>\s+</g, '><');
      const textContent = extractTextFromHtml(cleanedJobListingElem);

      let companyName = getDefaultIfEmpty(document.querySelector('.jobs-unified-top-card__primary-description .app-aware-link')?.textContent?.trim() || '', 'Company');
      let recruiter = getDefaultIfEmpty((document.querySelector('.artdeco-card .jobs-poster__name') as HTMLElement)?.innerText.trim(), 'Hiring Manager');
      const date = new Date().toLocaleDateString();

      const postData = {
        "Company-name": companyName,
        "Job-Listing": textContent,
        "Recruiter": recruiter,
        "Date": date,
        "apiKey": storedApiKey  // Include the API key in postData
      };

      try {
        const response = await fetch('http://127.0.0.1:3000/generate-cover-letter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(postData),
          credentials: 'include'
        });

        if (response.status === 404) {
          throw new Error('Resource not found');
        } else if (response.status >= 500) {
          throw new Error('Server error');
        } else if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${companyName}_cv.docx`;
        document.body.appendChild(a);
        a.click();
        a.remove();

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    handleDownload();
  };

  if (!window.location.href.includes("linkedin.com")) return null;

  return (
    <div onClick={handleClick}
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
      {isLoading ? <span>Loading...</span> : (isExpanded && <span style={{ color: 'white', marginRight: '10px' }}>Generate Cover Letter</span>)}
    </div>
  );
};

export default DownloadButton;
