import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import DOMPurify from 'dompurify';
import './content.styles.css';
import './content.styles.scss';



const DownloadButton = () => {

  const headerRef = useRef<HTMLElement | null>(null);
  const jobBodyRef = useRef<HTMLElement | null>(null);
  const employerRef = useRef<HTMLElement | null>(null);
  const [errorMessage, setErrorMessage] = useState('');



  useEffect(() => {
    const observer = new MutationObserver((mutationsList, observer) => {
      const headerElem = document.querySelector('.p5');
      const jobBodyElem = document.querySelector('.jobs-description__content #job-details');
      const employerElem = document.querySelector('.artdeco-card .jobs-poster__name');

      if (headerElem && jobBodyElem) {
        headerRef.current = headerElem as HTMLElement;
        jobBodyRef.current = jobBodyElem as HTMLElement;

        // Only set the employerRef if the employerElem is found
        if (employerElem) {
          employerRef.current = employerElem as HTMLElement;
        }

        observer.disconnect(); // Stop observing once the required elements are found
      }
    });

    // Start observing the document with the configured parameters
    observer.observe(document, { childList: true, subtree: true });

    return () => observer.disconnect(); // Cleanup the observer on component unmount
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

  function getDataFromBackground(callback: (data: { token: string | null, apiKey: string | null }) => void) {
    chrome.runtime.sendMessage({ type: 'GET_DATA' }, function (response) {
      callback({
        token: response && response.token ? response.token : null,
        apiKey: response && response.apiKey ? response.apiKey : null
      });
    });
  }




  const handleCoverDownload = async () => {
    getDataFromBackground(async (data) => {
      const { token, apiKey } = data;

      if (!token) {
        console.log("Token not found in background.");
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
          "apiKey": apiKey,
          "user_id": token
        };

        setIsLoading(true);

        try {
          const response = await fetch('https://lynk.up.railway.app/cover-letter', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify(postData),
          });

          if (response.status === 404) {
            const errorMsg = "Resume file not found! 404";
            console.log(errorMsg);
            setErrorMessage(errorMsg);
            return;
          } else if (response.status >= 500) {
            const errorMsg = "Check your OpenAI API Key! 500";
            console.log(errorMsg);
            // Capture the server error message
            response.text().then(serverError => {
              console.log("Server Error:", serverError);
              setErrorMessage(`${errorMsg}. Server says: ${serverError}`);
            });
            return;
          } else if (!response.ok) {
            const errorMsg = `HTTP error! Status: ${response.status}`;
            console.log(errorMsg);
            // Capture the server error message
            response.text().then(serverError => {
              console.log("Error:", serverError);
              setErrorMessage(`${errorMsg}. Server says: ${serverError}`);
            });
            return; // Exit early on error
          }


          console.log("Creating blob and initiating download.");
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `${companyName}_cv.docx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (error) {
          console.log('Error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    });
  };




  const handleResumeDownload = async () => {

    getDataFromBackground(async (data) => {
      const { token, apiKey } = data;
      if (!token) {
        console.log("Token not found in background.");
        //toast.error("Enter your API key in the extension popup!", { position: toast.POSITION.TOP_CENTER });
        setIsLoading(false);
        return;
      }

      if (jobBodyRef.current) {
        const jobBodyElem = sanitizeHTML(jobBodyRef.current.innerHTML.trim());
        const jobDescriptionElem = jobBodyElem;

        const cleanedJobDescriptionElem = jobDescriptionElem.replace(/>\s+</g, '><');
        const jobDescriptionTextContent = extractTextFromHtml(cleanedJobDescriptionElem);

        const postData = {
          "Job-Description": jobDescriptionTextContent,
          "apiKey": apiKey,  // Include the API key in postData
          "user_id": token
        };

        setIsLoading(true);

        try {
          const response = await fetch('https://lynk.up.railway.app/generate-resume', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify(postData),
          });

          if (response.status === 404) {
            const errorMsg = "Resume file not found! 404";
            console.log(errorMsg);
            setErrorMessage(errorMsg);
            return;
          } else if (response.status >= 500) {
            const errorMsg = "Check your OpenAI API Key! 500";
            console.log(errorMsg);
            // Capture the server error message
            response.text().then(serverError => {
              console.log("Server Error:", serverError);
              setErrorMessage(`${errorMsg}. Server says: ${serverError}`);
            });
            return;
          } else if (!response.ok) {
            const errorMsg = `HTTP error! Status: ${response.status}`;
            console.log(errorMsg);
            // Capture the server error message
            response.text().then(serverError => {
              console.log("Error:", serverError);
              setErrorMessage(`${errorMsg}. Server says: ${serverError}`);
            });
            return; // Exit early on error
          }



          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `new_resume.docx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (error) {
          //toast.error("An error occurred while downloading the resume!");
          console.log('Error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    });
  }


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

  const handleMouseEnter = () => {
    setButtonStyle({ ...buttonStyle, background: '#cc39a4' });
    setIconStyle({ ...iconStyle, fill: 'black' });
  };

  const handleMouseLeave = () => {
    setButtonStyle({ ...buttonStyle, background: 'black' });
    setIconStyle({ ...iconStyle, fill: '#cc39a4' });
  };

  //auth to send to other tabs 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('authToken', (result) => {
      if (result.authToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  const handleLoginClick = () => {
    chrome.runtime.sendMessage({ action: "openNewTab" }, function (response) {
      console.log(response.message);
    });
  };





  // 1. React component for the button
  const QuickApplyButton: React.FC = () => {
    return (
      <button
        id="new-apply-button"
        type="button"
        className="quick-apply-button"
        aria-label="Autofill"
        onClick={handleCoverDownload}
      >
        Generate CV
      </button>

    );
  };

  // 2. Identify the position to inject the button and render it
  const injectButton = () => {
    // Check if the button is already present
    const existingButton = document.getElementById('new-apply-button');
    if (existingButton) return;  // If it exists, do not inject again

    const targetElement = document.querySelector('.jobs-save-button');

    if (targetElement) {
      const div = document.createElement('div');
      const parentNode = targetElement.parentNode;
      if (parentNode) {
        parentNode.insertBefore(div, targetElement.nextSibling);
        ReactDOM.render(<QuickApplyButton />, div);
      }
    }
  };


  // Use MutationObserver to watch for changes in the DOM
  const observeDOMChanges = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check if our button still exists in the DOM
        if (!document.getElementById('new-apply-button')) {
          injectButton();
        }
      });
    });

    observer.observe(document.body, {
      childList: true, // observe direct children changes
      subtree: true,   // and lower descendants too
    });
  };

  window.addEventListener('load', () => {
    injectButton();
    observeDOMChanges();
  });


  if (!window.location.href.includes("linkedin.com/jobs/")) return null;


  return (

    isAuthenticated ? (
      <>
        <div className="main" style={{ position: 'fixed', top: '50%', right: '0', transform: 'translateY(-50%)', zIndex: 9999 }}>

          <div className="card1" onClick={handleCoverDownload} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="icon-container">
              {isLoading ? (

                <div>
                  <h1>Generating</h1>
                  {/* Fill */}
                  <svg width={0} height={0}>
                    <filter id="gooey-fill">
                      <feGaussianBlur in="SourceGraphic" stdDeviation={20} result="blur" />
                      <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -16"
                        result="goo"
                      />
                    </filter>
                  </svg>
                  <div className="fill">
                    <div className="gooey-container">
                      <span className="level">
                        <span className="bubble" />
                        <span className="bubble" />
                        <span className="bubble" />
                        <span className="bubble" />
                        <span className="bubble" />
                        <span className="bubble" />
                        <span className="bubble" />
                        <span className="bubble" />
                      </span>
                    </div>
                  </div>
                  {/*/Fill */}
                </div>


              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="45"
                  height="45"
                  viewBox="0 0 24 24"
                  className="instagram"
                  color='#5e5bc2'
                >
                  <rect
                    width="4.72"
                    height="4.72"
                    x="-2.36"
                    y="-2.36"
                    rx="0.52"
                    ry="0.52"
                    transform="matrix(.83 0 0 .83 12 12) translate(2.26 -6.22)"
                  ></rect>
                  <path
                    d="M1.97-.75h-3.95a.75.75 0 000 1.5h3.95a.75.75 0 100-1.5z"
                    transform="matrix(.83 0 0 .83 12 12) translate(-4.7 -7.72)"
                  ></path>
                  <path
                    d="M-7.57 1.79v-4.91a.33.33 0 01.27-.35H7.29a.32.32 0 01.27.35v7.87h.4c.378 0 .751.075 1.1.22v-8.09a1.81 1.81 0 00-1.77-1.85H-7.3a1.82 1.82 0 00-1.77 1.85v4.91z"
                    transform="matrix(.83 0 0 .83 12 12) translate(-1.29 -7.03)"
                  ></path>
                  <path
                    d="M10.89-5.32a.752.752 0 00-.6 1.38.34.34 0 01.2.42L8.16 2.57v-6a1.48 1.48 0 00-1.48-1.48H-4.57l-1.07-2.2a1.49 1.49 0 00-1.35-.78h-3.51a1.48 1.48 0 00-1.49 1.48V6.41a1.48 1.48 0 001.49 1.48H6.68a1.62 1.62 0 001.33-.84l3.84-10a1.85 1.85 0 00-.96-2.37zM-3.66 3.51a.75.75 0 110 1.5 3 3 0 01-2.95-2.95V.96a3 3 0 013-3 .75.75 0 110 1.5c-.8 0-1.45.65-1.45 1.45v1.1a1.45 1.45 0 001.4 1.5zM2.59.63a6.42 6.42 0 01-1.58 4.11.76.76 0 01-.58.27.74.74 0 01-.57-.27A6.36 6.36 0 01-1.69.63v-1.87a.75.75 0 111.5 0V.63a4.72 4.72 0 00.62 2.32A4.73 4.73 0 001.06.63v-1.87a.75.75 0 111.5 0z"
                    transform="matrix(.83 0 0 .83 12 12) translate(-.01 4.11)"
                  ></path>
                </svg>
              )}
            </div>
          </div>
          <div className="card3" onClick={handleResumeDownload} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="45"
              height="45"
              viewBox="0 0 24 24"
              color="#5e5bc2"
              className="bi-bi-github"
            >
              <path
                d="M9.62 17.8H5.37a.75.75 0 100 1.5h4.25a.75.75 0 100-1.5z"
                transform="matrix(.83 0 0 .83 12 12) translate(-4.51 6.55) translate(-7.49 -18.55)"
              ></path>
              <path
                d="M9.18 3.17a5.72 5.72 0 100 11.44 5.72 5.72 0 000-11.44zm0 2.54a1.68 1.68 0 110 3.36 1.68 1.68 0 010-3.36zm0 7.7a6.16 6.16 0 01-3-.94 3.12 3.12 0 016 0 6.16 6.16 0 01-3 .94z"
                transform="matrix(.83 0 0 .83 12 12) translate(-2.82 -3.11) translate(-9.18 -8.89)"
              ></path>
              <path
                d="M19.19 13.5l1.4 3.69h2.72a.67.67 0 01.47 1.17L21.42 20l1.31 3a.71.71 0 01-1 .89l-3.16-1.78-3.19 1.79a.71.71 0 01-1-.89l1.31-3-2.37-1.65a.67.67 0 01.47-1.17h2.71l1.4-3.69a.73.73 0 011.29 0z"
                transform="matrix(.83 0 0 .83 12 12) translate(6.55 6.55) translate(-18.55 -18.55)"
              ></path>
              <path
                d="M13 22.45H1.77a.27.27 0 01-.27-.27V1.77c0-.15.12-.27.27-.27h15.31c.15 0 .27.12.27.27V12a2.16 2.16 0 011.2-.35c.1-.01.2-.01.3 0V1.77A1.77 1.77 0 0017.08 0H1.77A1.77 1.77 0 000 1.77v20.41A1.77 1.77 0 001.77 24H12.9a2.21 2.21 0 01.1-1.55z"
                transform="matrix(.83 0 0 .83 12 12) translate(-2.58) translate(-9.42 -12)"
              ></path>
            </svg>
          </div>
        </div>



      </>

    ) : (

      <div className="main" style={{ position: 'fixed', top: '50%', right: '0', transform: 'translateY(-50%)', zIndex: 9999 }}>
        <div className="card1" onClick={handleLoginClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>

          <div className="icon-container">
            {isLoading ? (

              <div>
                <h1>Generating</h1>
                {/* Fill */}
                <svg width={0} height={0}>
                  <filter id="gooey-fill">
                    <feGaussianBlur in="SourceGraphic" stdDeviation={20} result="blur" />
                    <feColorMatrix
                      in="blur"
                      mode="matrix"
                      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -16"
                      result="goo"
                    />
                  </filter>
                </svg>
                <div className="fill">
                  <div className="gooey-container">
                    <span className="level">
                      <span className="bubble" />
                      <span className="bubble" />
                      <span className="bubble" />
                      <span className="bubble" />
                      <span className="bubble" />
                      <span className="bubble" />
                      <span className="bubble" />
                      <span className="bubble" />
                    </span>
                  </div>
                </div>
                {/*/Fill */}
              </div>


            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#8F9EB6"
                  d="M63 84H37c-8.284 0-15-6.716-15-15V48a5 5 0 015-5h46a5 5 0 015 5v21c0 8.284-6.716 15-15 15z"
                  transform="matrix(.2 0 0 .2 12 12) translate(0 13.5) translate(-50 -63.5)"
                ></path>
                <path
                  fill="#FCBA7F"
                  d="M22 51h56v10H22z"
                  transform="matrix(.2 0 0 .2 12 12) translate(0 6) translate(-50 -56)"
                ></path>
                <path
                  fill="#4E6D91"
                  d="M53.5 77.5l-1.896-7.583a2.5 2.5 0 10-3.208 0L46.5 77.5h7z"
                  transform="matrix(.2 0 0 .2 12 12) translate(0 21.5) translate(-50 -71.5)"
                ></path>
                <path
                  fill="#B3B2C3"
                  d="M36 42v-6.605c0-7.538 5.793-14.025 13.323-14.379C57.363 20.637 64 27.044 64 35v7.5h7v-6.997c0-11.387-8.854-21.085-20.234-21.49C38.819 13.589 29 23.148 29 35v7h7z"
                  transform="matrix(.2 0 0 .2 12 12) translate(0 -21.75) translate(-50 -28.25)"
                ></path>
                <path
                  fill="#1F212B"
                  d="M63 85H37c-8.822 0-16-7.178-16-16V48c0-3.309 2.691-6 6-6h46c3.309 0 6 2.691 6 6v21c0 8.822-7.178 16-16 16zM27 44c-2.206 0-4 1.794-4 4v21c0 7.72 6.28 14 14 14h26c7.72 0 14-6.28 14-14V48c0-2.206-1.794-4-4-4H27z"
                  transform="matrix(.2 0 0 .2 12 12) translate(0 13.5) translate(-50 -63.5)"
                ></path>
                <path
                  fill="#1F212B"
                  d="M72 42.5h-2v-6.997c0-10.92-8.645-20.112-19.27-20.49-5.479-.192-10.678 1.792-14.617 5.594C32.171 24.412 30 29.523 30 35v7h-2v-7c0-6.025 2.388-11.647 6.725-15.832 4.333-4.183 10.055-6.363 16.076-6.154C62.49 13.43 72 23.519 72 35.503V42.5z"
                  transform="matrix(.2 0 0 .2 12 12) translate(0 -22.25) translate(-50 -27.75)"
                ></path>
                <path
                  fill="#1F212B"
                  d="M65 42.5h-2V35a12.89 12.89 0 00-4.028-9.408c-2.595-2.476-5.989-3.75-9.602-3.577C42.434 22.341 37 28.219 37 35.396V42h-2v-6.604c0-8.247 6.271-15.001 14.276-15.378 4.134-.191 8.08 1.27 11.076 4.128A14.862 14.862 0 0165 35v7.5zM78 52H65.5a.5.5 0 010-1H78a.5.5 0 010 1zm-15.5 0h-5a.5.5 0 010-1h5a.5.5 0 010 1zm-8 0H22a.5.5 0 010-1h32.5a.5.5 0 010 1zM22 60h56v1H22zm31.5 18h-7a.503.503 0 01-.486-.621l1.824-7.297a3 3 0 114.323 0l1.824 7.297A.5.5 0 0153.5 78zm-6.359-1h5.719l-1.74-6.961a.5.5 0 01.164-.504A2.002 2.002 0 0050 66a2.002 2.002 0 00-1.283 3.534c.146.123.21.319.164.504L47.141 77z"
                  transform="matrix(.2 0 0 .2 12 12) translate(0 -1) translate(-50 -49)"
                ></path>
                <path
                  fill="#1F212B"
                  d="M20.018 55.504h11.446v1H20.018z"
                  transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 -6.42 26.219) translate(-25.74 -56)"
                ></path>
                <path
                  fill="#1F212B"
                  d="M28.018 55.504h11.446v1H28.018z"
                  transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 -2.407 18.567) translate(-33.74 -56)"
                ></path>
                <path
                  fill="#1F212B"
                  d="M36.018 55.504h11.446v1H36.018z"
                  transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 1.606 10.915) translate(-41.74 -56)"
                ></path>
                <path
                  fill="#1F212B"
                  d="M44.018 55.504h11.446v1H44.018z"
                  transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 5.609 3.258) translate(-49.74 -56)"
                ></path>
                <path
                  fill="#1F212B"
                  d="M52.018 55.504h11.446v1H52.018z"
                  transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 9.621 -4.394) translate(-57.74 -56)"
                ></path>
                <path
                  fill="#1F212B"
                  d="M60.018 55.504h11.446v1H60.018z"
                  transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 13.634 -12.046) translate(-65.74 -56)"
                ></path>
                <path
                  fill="#1F212B"
                  d="M68.018 55.504h11.446v1H68.018z"
                  transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 17.646 -19.698) translate(-73.74 -56)"
                ></path>
              </svg>
            )}
          </div>
        </div>
        <div className="card3" onClick={handleLoginClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 24 24"
          >
            <path
              fill="#8F9EB6"
              d="M63 84H37c-8.284 0-15-6.716-15-15V48a5 5 0 015-5h46a5 5 0 015 5v21c0 8.284-6.716 15-15 15z"
              transform="matrix(.2 0 0 .2 12 12) translate(0 13.5) translate(-50 -63.5)"
            ></path>
            <path
              fill="#FCBA7F"
              d="M22 51h56v10H22z"
              transform="matrix(.2 0 0 .2 12 12) translate(0 6) translate(-50 -56)"
            ></path>
            <path
              fill="#4E6D91"
              d="M53.5 77.5l-1.896-7.583a2.5 2.5 0 10-3.208 0L46.5 77.5h7z"
              transform="matrix(.2 0 0 .2 12 12) translate(0 21.5) translate(-50 -71.5)"
            ></path>
            <path
              fill="#B3B2C3"
              d="M36 42v-6.605c0-7.538 5.793-14.025 13.323-14.379C57.363 20.637 64 27.044 64 35v7.5h7v-6.997c0-11.387-8.854-21.085-20.234-21.49C38.819 13.589 29 23.148 29 35v7h7z"
              transform="matrix(.2 0 0 .2 12 12) translate(0 -21.75) translate(-50 -28.25)"
            ></path>
            <path
              fill="#1F212B"
              d="M63 85H37c-8.822 0-16-7.178-16-16V48c0-3.309 2.691-6 6-6h46c3.309 0 6 2.691 6 6v21c0 8.822-7.178 16-16 16zM27 44c-2.206 0-4 1.794-4 4v21c0 7.72 6.28 14 14 14h26c7.72 0 14-6.28 14-14V48c0-2.206-1.794-4-4-4H27z"
              transform="matrix(.2 0 0 .2 12 12) translate(0 13.5) translate(-50 -63.5)"
            ></path>
            <path
              fill="#1F212B"
              d="M72 42.5h-2v-6.997c0-10.92-8.645-20.112-19.27-20.49-5.479-.192-10.678 1.792-14.617 5.594C32.171 24.412 30 29.523 30 35v7h-2v-7c0-6.025 2.388-11.647 6.725-15.832 4.333-4.183 10.055-6.363 16.076-6.154C62.49 13.43 72 23.519 72 35.503V42.5z"
              transform="matrix(.2 0 0 .2 12 12) translate(0 -22.25) translate(-50 -27.75)"
            ></path>
            <path
              fill="#1F212B"
              d="M65 42.5h-2V35a12.89 12.89 0 00-4.028-9.408c-2.595-2.476-5.989-3.75-9.602-3.577C42.434 22.341 37 28.219 37 35.396V42h-2v-6.604c0-8.247 6.271-15.001 14.276-15.378 4.134-.191 8.08 1.27 11.076 4.128A14.862 14.862 0 0165 35v7.5zM78 52H65.5a.5.5 0 010-1H78a.5.5 0 010 1zm-15.5 0h-5a.5.5 0 010-1h5a.5.5 0 010 1zm-8 0H22a.5.5 0 010-1h32.5a.5.5 0 010 1zM22 60h56v1H22zm31.5 18h-7a.503.503 0 01-.486-.621l1.824-7.297a3 3 0 114.323 0l1.824 7.297A.5.5 0 0153.5 78zm-6.359-1h5.719l-1.74-6.961a.5.5 0 01.164-.504A2.002 2.002 0 0050 66a2.002 2.002 0 00-1.283 3.534c.146.123.21.319.164.504L47.141 77z"
              transform="matrix(.2 0 0 .2 12 12) translate(0 -1) translate(-50 -49)"
            ></path>
            <path
              fill="#1F212B"
              d="M20.018 55.504h11.446v1H20.018z"
              transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 -6.42 26.219) translate(-25.74 -56)"
            ></path>
            <path
              fill="#1F212B"
              d="M28.018 55.504h11.446v1H28.018z"
              transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 -2.407 18.567) translate(-33.74 -56)"
            ></path>
            <path
              fill="#1F212B"
              d="M36.018 55.504h11.446v1H36.018z"
              transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 1.606 10.915) translate(-41.74 -56)"
            ></path>
            <path
              fill="#1F212B"
              d="M44.018 55.504h11.446v1H44.018z"
              transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 5.609 3.258) translate(-49.74 -56)"
            ></path>
            <path
              fill="#1F212B"
              d="M52.018 55.504h11.446v1H52.018z"
              transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 9.621 -4.394) translate(-57.74 -56)"
            ></path>
            <path
              fill="#1F212B"
              d="M60.018 55.504h11.446v1H60.018z"
              transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 13.634 -12.046) translate(-65.74 -56)"
            ></path>
            <path
              fill="#1F212B"
              d="M68.018 55.504h11.446v1H68.018z"
              transform="matrix(.2 0 0 .2 12 12) rotate(-55.3 17.646 -19.698) translate(-73.74 -56)"
            ></path>
          </svg>
        </div>
      </div>
    )
  );
};

export default DownloadButton;