import React, { useState, useEffect } from 'react';
import './Popup.css';
import './Popup.scss';
import globeImg from './globe.png'; // Correct way to import image
import logo from '../../assets/img/icon-128.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Popup = () => {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [showPassword, setShowPassword] = useState(false);



  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };


  const fileInputRef = React.useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };

  const LockIcon = () => (
    <svg viewBox="97 6 809 988" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <g fill="#5e5bc2">
        <path d="M321.8,455.5h356.4V321.8c0-49.2-17.4-91.2-52.2-126c-34.8-34.8-76.8-52.2-126-52.2c-49.2,0-91.2,17.4-126,52.2c-34.8,34.8-52.2,76.8-52.2,126L321.8,455.5L321.8,455.5z M900.9,522.3v400.9c0,18.6-6.5,34.3-19.5,47.3c-13,13-28.8,19.5-47.3,19.5H165.9c-18.6,0-34.3-6.5-47.3-19.5c-13-13-19.5-28.8-19.5-47.3V522.3c0-18.6,6.5-34.3,19.5-47.3c13-13,28.8-19.5,47.3-19.5h22.3V321.8c0-85.4,30.6-158.7,91.9-219.9C341.3,40.7,414.7,10,500,10c85.3,0,158.7,30.6,219.9,91.9c61.3,61.3,91.9,134.6,91.9,219.9v133.6h22.3c18.6,0,34.3,6.5,47.3,19.5C894.4,488,900.9,503.7,900.9,522.3L900.9,522.3z" />
      </g>
    </svg>
  );

  const EyeIcon = () => (
    <svg viewBox="-20 -200 320 400" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <style>{`
        #eye{--duration-blink: .2s;--duration-lashes: .2s;--delay-lashes: var(--duration-blink);--duration-pupil: .1s;--delay-pupil: calc(var(--duration-blink)*2/3);}
        #eye-bottom,#eye-top{stroke-linecap:round;}
        #eye-top,#eye-lashes{transition: var(--duration-blink) ease-in;}
        #eye-pupil {opacity: 0;transition:opacity var(--duration-pupil) var(--delay-pupil) ease;}
        .eye-open #eye-top,.eye-open #eye-lashes{transform: rotateX(.5turn);animation:scaleUp var(--duration-lashes) var(--delay-lashes) ease-in-out;}
        .eye-open #eye-pupil{opacity:1;}
        .eye-close #eye-lashes{animation:scaleDown var(--duration-lashes) var(--duration-blink) ease-in-out;}
        .eye-close #eye-pupil{opacity:0;}
        @keyframes scaleUp {50%{transform:rotateX(.5turn) scaleY(1.15); }to{transform:rotateX(.5turn) scaleY(1);}}
        @keyframes scaleDown {50%{transform:scaleY(1.15);}to{transform:scaleY(1); }}
      `}</style>
      <g id="eye" strokeWidth="30" fill="none">
        <g id="eye-lashes" stroke="currentColor">
          <line x1="140" x2="140" y1="90" y2="180" />
          <line x1="70" x2="10" y1="60" y2="140" />
          <line x1="210" x2="270" y1="60" y2="140" />
        </g>
        <path id="eye-bottom" d="m0,0q140,190 280,0" stroke="currentColor" />
        <path id="eye-top" d="m0,0q140,190 280,0" stroke="currentColor" />
        <circle id="eye-pupil" cx="140" cy="0" r="50" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );


  const validateApiKeyFormat = (key) => {
    return /^sk-[a-zA-Z0-9]{32,}$/.test(key);
  };

  const [uploadedResume, setUploadedResume] = useState('');

  function getUserIdFromToken(callback) {
    chrome.storage.local.get('authToken', function (result) {
      if (result.authToken) {
        const token = result.authToken;

        // Decode the token to get the user ID
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload); // decode from base64
        const jsonData = JSON.parse(decodedPayload);

        const userId = jsonData.user;

        callback(userId);
      } else {
        console.error('No token found in storage.');
        toast.error('No token found in storage.');
        callback(null);
      }
    });

  }

  function getUserIdFromStorage() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('authToken', function (result) {
        if (result.authToken) {
          resolve(result.authToken);
        } else {
          reject('No token found in storage.');
        }
      });
    });
  }

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    // Read the content of the uploaded file
    const fileContent = await file.text();
    setUploadedResume(fileContent);

    // Get user_id from chrome storage
    try {
      const userId = await getUserIdFromStorage();
      // Append user_id to formData
      formData.append('user_id', userId);
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload resume.');
      return;  // Exit the function if no user ID is found
    }

    console.log(formData);

    try {
      const response = await fetch('https://lynk.up.railway.app/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log('Resume uploaded successfully');
        toast.success('Resume uploaded successfully');
      } else {
        console.error('Failed to upload resume:', data.message);
        toast.error('Failed to upload resume.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload resume.');
    }
  };



  const handleGlobeClick = async (e) => {
    e.preventDefault();
    try {
      const authResponse = await fetch('https://lynk.up.railway.app/apiverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: apiKey }),
        credentials: 'include'
      });
      const data = await authResponse.json();
      if (authResponse.ok && data.success) {
        const token = data.token;
        await chrome.storage.local.set({ token: token });
        console.log('JJ & GPT successfully connected!');
        toast.success('JJ & GPT successfully connected!');
      } else {
        console.log('Failed to authenticate.');
        toast.error('Failed to authenticate.');
      }
    } catch (error) {
      console.log('Error authenticating:', error);
      alert('Failed to authenticate.');
      setMessage('Failed to authenticate.');
    }

  };


  async function handleLogout() {

    try {

      // Fetch the token from chrome storage
      const authToken = await new Promise((resolve, reject) => {
        chrome.storage.local.get('GET_DATA', (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError));
          } else {
            resolve(result.authToken);
          }
        });
      });

      // Call backend logout endpoint for clarity (even though it doesn't do much in our simple example)
      const response = await fetch('https://lynk.up.railway.app/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Logout successful!');

        // Remove the auth token from local storage
        chrome.storage.local.remove('authToken');

        // Redirect the user to the login page or any other page
        window.location.href = "https://job-jolt.vercel.app/";
      } else {
        switch (data.message) {
          case "Invalid or expired token":
            toast.error('Logout failed: Your session has expired. Please log in again.');
            break;
          case "Token missing.":
            toast.error('Logout failed: Token is missing. Please log in and try again.');
            break;
          case "User not found.":
            toast.error('Logout failed: User not found. Please contact support.');
            break;
          case "Token has been blacklisted.":
            toast.error('Token has been blacklisted. Please log in again.');
            break;
          default:
            toast.error('Logout failed: ' + data.message);
            break;
        }
      }
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  }






  useEffect(() => {
    chrome.storage.local.get(['apiKey', 'SET_API_KEY'], result => {
      if (result.apiKey) {
        setApiKey(result.apiKey);
      } else {
        console.log('No API key found in storage.');
      }
    });
  }, []);


  useEffect(() => {
    if (apiKey === '') {
      setIsValid(null);
    } else {
      setIsValid(validateApiKeyFormat(apiKey));
      chrome.storage.local.set({ apiKey: apiKey }).then(() => {
        console.log('API key is stored in chrome storage.');

        // Send the API key to the background script
        chrome.runtime.sendMessage({ type: 'SET_API_KEY', apiKey: apiKey }, function (response) {
          console.log(response.message);
        });
      });

    }
  }, [apiKey]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size <= 5 * 1024 * 1024) { // 5MB in bytes
        handleFileUpload(file);
      } else {
        console.error('File is too large');
      }
    }
  };

  //auth to send to other tabs 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('authToken', (result) => {
      if (result.authToken) {
        setIsAuthenticated(true);
      }
      else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  const handleLoginClick = () => {
    chrome.tabs.create({ url: 'newtab.html' });
  };

  return (
    <>
      <ToastContainer />
      {isAuthenticated ? (
        <div className="popup-container">
          <div className="header">
            <label className="label" htmlFor="api-key">Job Jolt Chrome Extension</label>
            <a href="#" onClick={handleGlobeClick}>
              <img src={globeImg} className="icon" alt="external-link" />
            </a>


            <button className="logout-btn" href="#" onClick={handleLogout} >
              <div className="sign">
                <svg viewBox="0 0 512 512">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                </svg>
              </div>
              <div className="text">Logout</div>
            </button>

          </div>

          <div className={`form-group transition-container ${showPassword ? 'js-show-pw eye-open' : 'eye-close'}`}>
            <input
              type={showPassword ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={`form-control-lg form-control-black transition-input ${showPassword ? "show-input" : ""} ${isValid === true ? 'success' : isValid === false ? 'error' : 'neutral'}`}
              placeholder="OpenAI API Key"
            />
            {/* Lock and Eye icons */}
            <span className="icon-lock" style={{ position: 'absolute', left: '8px', top: '55%', transform: 'translateY(-50%)', width: '15px', height: '21px', fill: '#5e5bc2' }}>
              <LockIcon />
            </span>
            <span className="icon-eye middle-right js-transition" onClick={togglePasswordVisibility}>
              <EyeIcon />
            </span>
          </div>

          {isValid === true && <p className="text-success">Well done! Your API key format is valid.</p>}
          {isValid === false && <p className="text-error">Oh, snap! Your API key format is not valid.</p>}

          <div className="resume-upload-container">
            <input
              ref={fileInputRef}
              className="input-file"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button className="btn" type="button" onClick={handleButtonClick}>
              <strong>Upload Resume</strong>
              <div id="container-stars">
                <div id="stars"></div>
              </div>
              <div id="glow">
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
            </button>
            <p className="text-help"> pdf, docx or txt (max 5 mb ) </p>

          </div>
        </div>
      ) : (
        // JSX for unauthenticated user (i.e., the form)
        <form className="form">
          <div className="title">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              Job Jolt,
              <img src={logo} className="logo" alt="external-link" />
            </div>

          </div>
          <div className="meow">Login / Sign up to continue</div>
          <button className="flip-card__btn" onClick={handleLoginClick}>Login →</button>
        </form>
      )}
    </>
  );
};


export default Popup;