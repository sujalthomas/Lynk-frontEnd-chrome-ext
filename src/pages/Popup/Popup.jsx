import React, { useState, useEffect } from 'react';
import './Popup.css';
import './Popup.scss';
import globeImg from './globe.png'; // Correct way to import image

const Popup = () => {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://127.0.0.1:3000/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log('Resume uploaded successfully');
      } else {
        console.error('Failed to upload resume:', data.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  const handleGlobeClick = async (e) => {
    e.preventDefault();
    // In the authentication request:
    const authResponse = await fetch('http://127.0.0.1:3000/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey: apiKey }), // Use apiKey here
      credentials: 'include'
    });

    if (authResponse.ok) {
      const data = await authResponse.json();
      const token = data.token;
      await chrome.storage.local.set({ token: token });
      alert('Successfully authenticated!');
    } else {
      alert('Failed to authenticate.');
    }


  };


  useEffect(() => {
    chrome.storage.local.get(['apiKey', 'token'], result => {
      if (result.apiKey) {
        setApiKey(result.apiKey);
      }
      // No need to store token in a state variable for now, but you can if you need to use it elsewhere in this component.
    });
  }, []);


  useEffect(() => {
    if (apiKey === '') {
      setIsValid(null);
    } else {
      setIsValid(validateApiKeyFormat(apiKey));
      chrome.storage.local.set({ apiKey: apiKey }).then(() => {
        console.log('API key is stored in chrome storage.');
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


  return (
    <div className="popup-container">
      <div className="header">
        <label className="label" htmlFor="api-key">Lynk Chrome Extension</label>
        <a href="#" onClick={handleGlobeClick}>
          <img src={globeImg} className="icon" alt="external-link" />
        </a>
      </div>

      <div className={`form-group transition-container ${showPassword ? 'js-show-pw eye-open' : 'eye-close'}`}>
        <input
          type={showPassword ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className={`form-control-lg form-control-black transition-input ${showPassword ? "show-input" : ""} ${isValid === true ? 'success' : isValid === false ? 'error' : 'neutral'}`}
          placeholder="OpenAI API Key" // Adding the placeholder attribute here
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
        <label className="label_mt-4" htmlFor="file_input">Upload Your Resume</label>
        <input
          className="input-file"
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
          onChange={handleFileChange}
        />
        <p className="text-help"> pdf, docx or txt (max 5 mb ) </p>
      </div>
    </div>
  );
};


export default Popup;
