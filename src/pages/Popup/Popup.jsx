import React, { useState, useEffect } from 'react';
import './Popup.css';
import globeImg from './globe.png'; // Correct way to import image

const Popup = () => {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState(null);

  const validateApiKeyFormat = (key) => {
    return /^sk-[a-zA-Z0-9]{32,}$/.test(key);
  };

  useEffect(() => {
    chrome.storage.local.get(['apiKey'], result => {
      if (result.apiKey) {
        setApiKey(result.apiKey);
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
      });
    }
  }, [apiKey]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64string = reader.result;
        chrome.storage.local.set({ resumeFile: base64string }, () => {
          console.log('Resume file is stored in chrome storage.');
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="popup-container">
      <div className="header">
        <label className="label" htmlFor="api-key">Lynk Chrome Extension</label>
        <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
          <img src={globeImg} className="icon" alt="external-link" />
        </a>
      </div>
      <input
        type="text"
        id="api-key"
        className={`input ${isValid === true ? 'success' : isValid === false ? 'error' : 'neutral'}`}
        placeholder="Enter API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
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
