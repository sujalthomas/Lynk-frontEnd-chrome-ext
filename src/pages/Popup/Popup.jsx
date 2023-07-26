import React, { useState, useEffect } from 'react';
import './Popup.css';
import globeImg from './globe.png'; // Correct way to import image

const Popup = () => {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [isKeyHidden, setIsKeyHidden] = useState(true);
  

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

      <div className="api-input-container">
        <input
          type={isKeyHidden ? "password" : "text"} // This line toggles the visibility
          id="api-key"
          className={`input ${isValid === true ? 'success' : isValid === false ? 'error' : 'neutral'}`}
          placeholder="Enter API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button onClick={() => setIsKeyHidden(!isKeyHidden)}>
          {isKeyHidden ? "Show" : "Hide"}
        </button>
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
