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


          <div className="profile_info" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <img src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80" alt="" />
            <div className="profile_text" style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  color: 'white',
                  marginBottom: '5px'  // Added margin for spacing between name and addy
                }}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
              />
              <input
                style={{
                  width: "50%",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  color: 'white',
                }}
                value={addy}
                onChange={e => setAddy(e.target.value)}
                placeholder="Addy"
              />
            </div>
          </div>






        </div>
      </div>

      <div className="overview">
        <div style={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
          <h2>Dashboard Overview</h2>
          <div style={{ display: 'flex', alignItems: "center" }}>
            <h2 style={{ marginRight: "10px" }}>OpenAI Secret Key:</h2>
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
            {isValid === true && <p className="text-success">Well done! Your OpenAI key format is valid.</p>}
            {isValid === false && <p className="text-error">Oh, snap! Your OpenAI key format is not valid.</p>}
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
              <p>+ 23.3%</p>
            </div>
            <p className="overview_num">2067</p>
            <p className="overview_text">cv's</p>
          </div>
          <div className="overview_card">
            <div className="overview_top">
              <div>
                <img src="https://cdn-icons-png.flaticon.com/512/3128/3128304.png" alt="" />
                <p>Resumes generated</p>
              </div>
              <p>+ %</p>
            </div>
            <p className="overview_num">In the works</p>
            <p className="overview_text">August Update</p>
          </div>
          <div className="overview_card">
            <div className="overview_top">
              <div>
                <img src="https://cdn-icons-png.flaticon.com/512/3621/3621435.png" alt="" />
                <p>Time Saved</p>
              </div>
              <p>+ 43.4%</p>
            </div>
            <p className="overview_num">12,231</p>
            <p className="overview_text">minutes</p>
          </div>
        </div>

        <div className="statistics">
          <h2>Generation Rate</h2>
          <div className="stats_content">
            <div className="bar">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div>            <p>55</p>
              </div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className="bar_num_vert">
              <p>100</p>
              <p>80</p>
              <p>60</p>
              <p>40</p>
              <p>20</p>
              <p>0</p>
            </div>
            <div className="bar_month">
              <p>Jan</p>
              <p>Feb</p>
              <p>Mar</p>
              <p>Apr</p>
              <p>May</p>
              <p>Jun</p>
              <p>Jul</p>
              <p>Aug</p>
              <p>Sep</p>
              <p>Oct</p>
              <p>Nov</p>
              <p>Dec</p>
            </div>
            <div className="stats_selector">
              <p>July - August</p>
              <img src="https://img.icons8.com/ultraviolet/512/expand-arrow.png" alt="" />
            </div>
          </div>
        </div>

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
            <p>23,735</p>
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
