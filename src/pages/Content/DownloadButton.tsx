import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

const DownloadButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({
    width: '90px',
    height: '90px',
    outline: 'none',
    border: 'bold',
    background: 'black',
    borderRadius: '90px 5px 5px 5px',
    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
    transition: '.2s ease-in-out',
  });
  const [iconStyle, setIconStyle] = useState({
    marginTop: '1.5em',
    marginLeft: '1.2em',
    fill: '#cc39a4',
  });

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

  const handleGithubClick = () => {
    // Function for GitHub button (empty for now)
  };

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

  const handleMouseEnter = () => {
    setButtonStyle({ ...buttonStyle, background: '#cc39a4' });
    setIconStyle({ ...iconStyle, fill: 'black' });
  };

  const handleMouseLeave = () => {
    setButtonStyle({ ...buttonStyle, background: 'black' });
    setIconStyle({ ...iconStyle, fill: '#cc39a4' });
  };

  if (!window.location.href.includes("linkedin.com")) return null;

  return (
    <div className="main" style={{ position: 'fixed', top: '50%', right: '0', transform: 'translateY(-50%)', zIndex: 9999 }}>
      <div className="card1" onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="icon-container">
          {isLoading ? (
            <div className="loader">
              <div className="waves"></div>
            </div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              id="letter"
              className="instagram"
              color='#5e5bc2'
            >
              <path fill="#d3d5e7" d="M6.5 4.766v-.268c0-1.108-.892-2-2-2s-2 .892-2 2v1h4" />
              <path fill="#f0f0f0" d="M17.765 24.499H10.5v1c0 1.107-.892 2-2 2s-2-.893-2-2v-21c0-1.108-.892-2-2-2h19c1.108 0 2 .892 2 2v20h-3.576z" />
              <path fill="#d3d5e7" d="M8.5 27.499h19c1.108 0 2-.893 2-2v-1h-19v1c0 1.107-.892 2-2 2" />
              <path fill="#ffc408" d="m16.634 25.696 8.823-9.156 2.036 2.113-8.823 9.155z" />
              <path fill="#242c88" d="M4.45 1022.361a.5.5 0 0 0 .05 1h19c.84 0 1.5.66 1.5 1.5v11.867a.5.5 0 1 0 1 0v-11.867c0-1.376-1.124-2.5-2.5-2.5h-19a.5.5 0 0 0-.05 0z" transform="translate(0 -1020.362)" />
              <path fill="#ff5751" d="m18.67 27.809-1.357 1.408a.933.933 0 0 1-1.357 0l-.68-.704a1.02 1.02 0 0 1 0-1.408l1.358-1.409" />
              <path fill="#242c88" d="M16.615 1045.553a.5.5 0 0 0-.342.158l-1.357 1.408a1.523 1.523 0 0 0 0 2.104l.68.703a1.453 1.453 0 0 0 2.078 0l1.357-1.408a.5.5 0 0 0-.72-.694l-1.358 1.408c-.19.198-.447.198-.637 0l-.68-.705a.517.517 0 0 1 0-.713l1.358-1.41a.5.5 0 0 0-.379-.851z" transform="translate(0 -1020.362)" />
              <path fill="#242c88" d="M16.288 1045.699a.49.51 0 0 0 0 .72l2.035 2.112a.49.51 0 0 0 .694 0l8.823-9.156a.49.51 0 0 0 0-.72l-2.036-2.112a.49.51 0 0 0-.694 0l-8.822 9.156zm1.04.36 8.13-8.436 1.341 1.392-8.129 8.436-1.342-1.392z" transform="translate(0 -1020.362)" />
              <path fill="#d3d5e7" d="m25.457 16.54 3.054-1.056-1.018 3.17z" />
              <path fill="#242c88" d="M28.502 1035.346a.5.5 0 0 0-.154.027l-3.055 1.056a.5.5 0 0 0-.195.82l2.035 2.112a.5.5 0 0 0 .836-.193l1.017-3.17a.5.5 0 0 0-.484-.653zm-.773 1.299-.456 1.421-.912-.947 1.368-.474z" transform="translate(0 -1020.362)" />
              <path fill="#242c88" d="M18.336 1044.496a.5.5 0 0 0-.365.852l1.357 1.41a.5.5 0 1 0 .72-.695l-1.357-1.409a.5.5 0 0 0-.355-.158zm7.156-3.607a.5.5 0 0 0-.492.506v3.375a.5.5 0 1 0 1 0v-3.375a.5.5 0 0 0-.508-.506z" transform="translate(0 -1020.362)" />
              <path fill="#d3d5e7" d="M12.315 1036.869c-.35 0-.665.177-.933.443-.268.267-.494.625-.679 1.012-.37.774-.577 1.538-.577 2.228 0 .738.19 1.362.58 1.74.383.37.935.564 1.61.564.674 0 1.227-.194 1.61-.565.39-.377.58-1.001.58-1.74 0-.689-.208-1.453-.578-2.227-.185-.387-.41-.745-.678-1.012-.268-.266-.583-.443-.934-.443z" transform="translate(0 -1020.362)" />
              <path fill="#242c88" d="M12.314 1036.37c-.518 0-.956.26-1.285.587-.327.326-.576.73-.777 1.152-.394.824-.625 1.654-.625 2.444 0 .824.202 1.585.73 2.097.493.478 1.188.705 1.957.705h.002c.77 0 1.464-.227 1.957-.705.53-.512.733-1.273.733-2.097 0-.79-.233-1.62-.627-2.444-.202-.421-.45-.826-.777-1.152-.329-.327-.767-.588-1.286-.588h-.002zm0 1h.002c.183 0 .373.09.58.296.21.208.412.522.58.875.347.724.53 1.422.53 2.012 0 .652-.178 1.137-.428 1.379-.272.264-.683.423-1.262.423h-.002c-.578 0-.989-.16-1.261-.423-.25-.242-.426-.727-.426-1.38 0-.589.181-1.287.527-2.011.169-.352.372-.667.58-.875.208-.206.398-.297.58-.297z" transform="translate(0 -1020.362)" />
            </svg>
          )}
        </div>
      </div>
      <div className="card3" onClick={handleGithubClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="bi bi-github"
          style={{ fill: 'black' }}

        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </div>
    </div>
  );
};

export default DownloadButton;