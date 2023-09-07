import './Options.css';

import React, { useState, useEffect } from 'react';

function Options() {

  const [name, setName] = useState("");
  const [addy, setAddy] = useState("");
  const [openAIKey, setOpenAIKey] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);


  // Load any existing data from localStorage when the component mounts
  useEffect(() => {
    const savedName = localStorage.getItem('name');
    const savedAddy = localStorage.getItem('addy');
    const savedKey = localStorage.getItem('openAIKey');

    if (savedName) setName(savedName);
    if (savedAddy) setAddy(savedAddy);
    if (savedKey) setOpenAIKey(savedKey);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('name', name);
    localStorage.setItem('addy', addy);
    localStorage.setItem('openAIKey', openAIKey);
  }, [name, addy, openAIKey]);

  return (
    <div className='container' style={{ padding: '5px' }}>
      <div className="header">
        <h1 className="title">Lynk Connect</h1>
        <div className="profile_info" style={{ display: 'flex', justifyContent: 'flex-end' }}>

        </div>
      </div>

      <br>
        
        </br>

        <br>
        
        </br>

      <div className="overview">
        <div style={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
          <h2>Dashboard Overview</h2>
          <div style={{ display: 'flex', alignItems: "center" }}>
            <h2 style={{ marginRight: "10px" }}>OpenAI API Key:</h2>
            <input
              style={{
                width: "40%",
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "1rem"  // 1 point lesser than the h2 font size. Adjust this value accordingly.
              }}
              value={openAIKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpenAIKey(e.target.value)}
              className={`input ${isValid === true ? 'success' : isValid === false ? 'error' : 'neutral'}`}
              placeholder="Secret Key"
            />
          </div>
        </div>
        <p className="overview_total">Goodluck!</p>
        <div className="overview_content">
          <div className="overview_card">
            <div className="overview_top">
              <div>
                <img src="https://cdn-icons-png.flaticon.com/512/3128/3128304.png" alt="" />
                <p>Cover Letters generated</p>
              </div>
              <p>+ ∞%</p>
            </div>
            <p className="overview_num">∞</p>
            <p className="overview_text">cv's</p>
          </div>
          <div className="overview_card">
            <div className="overview_top">
              <div>
                <img src="https://cdn-icons-png.flaticon.com/512/3128/3128304.png" alt="" />
                <p>Resumes generated</p>
              </div>
              <p>+ ∞%</p>
            </div>
            <p className="overview_num">∞</p>
            <p className="overview_text">Resumes</p>
          </div>
          <div className="overview_card">
            <div className="overview_top">
              <div>
                <img src="https://cdn-icons-png.flaticon.com/512/3621/3621435.png" alt="" />
                <p>Time Saved</p>
              </div>
              <p>+ ∞%</p>
            </div>
            <p className="overview_num">∞</p>
            <p className="overview_text">minutes</p>
          </div>
        </div>

        <br>
        
        </br>

        <br>
        
        </br>

        <div style={{
          backgroundColor: '#ff9800',  // Orange background
          color: 'white',              // White text
          textAlign: 'center',         // Centered text
          padding: '30px 0',           // Padding top/bottom
          fontSize: '1.5rem',          // Font size
          fontWeight: 'bold',          // Bold text
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',  // Box shadow for a little depth
          marginBottom: '20px'         // Margin at the bottom to separate from other content
        }}>
          Under Construction, Thank You for Your Patience!
        </div>

        <br>
        
        </br>

        <br>
        
        </br>

        <div className="stats_cards_content">
          <div className="stats_card">
            <div className="stats_top">
              <img src="https://cdn-icons-png.flaticon.com/512/1144/1144695.png" alt="" />
              <p>Lynks</p>
            </div>
            <p>O O O O</p>
          </div>
          <div className="stats_card">
            <div className="stats_top">
              <img src="https://cdn-icons-png.flaticon.com/512/2589/2589175.png" alt="" />
              <p>Global CV's Generated</p>
            </div>
            <p>∞</p>
          </div>
          <div className="stats_card">
            <div className="stats_top">
              <img src="https://cdn-icons-png.flaticon.com/512/8913/8913473.png" alt="" />
              <p>Support my work </p>
            </div>
            <p>O O O O</p>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Options;
