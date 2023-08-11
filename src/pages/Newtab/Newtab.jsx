import React, { useState } from 'react';
import './Newtab.css';
import './Newtab.scss';

const Newtab = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  function handleCardFlip() {
    setIsFlipped(!isFlipped);
  }

  function handleButtonClick(e) {
    e.stopPropagation();
    // Your logic for handling the button click, such as signing in with Apple or Google
  }

  return (
    <div className="wrapper">
      <div className={`card-switch ${isFlipped ? 'flipped' : ''}`}>
        <label className="switch">
          <span onClick={handleCardFlip} className="slider"></span>
          <span className="card-side"></span>
          <div className="flip-card__inner">
            <div className="flip-card__front">
              <div className="title">Lynk</div>
              <form action="" className="flip-card__form">
                <input type="email" placeholder="Email" name="email" className="flip-card__input" />
                <input type="password" placeholder="Password" name="password" className="flip-card__input" />
                <div className="forgot">
                  <span> Forgot password?
                    <a href="https://www.google.com"> Reset here!</a>
                  </span>
                </div>
                <div className="separator">
                  <div></div>
                  <span>OR</span>
                  <div></div>
                </div>
                <div className="login-with">
                  <div onClick={handleButtonClick} className="button-log"></div>
                  <div className="button-log">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56.693"
                      height="56.693"
                      className="icon"
                      enableBackground="new 0 0 56.6934 56.6934"
                      version="1.1"
                      viewBox="0 0 56.693 56.693"
                      xmlSpace="preserve"
                    >
                      <path d="M51.981 24.481c-7.717-.004-15.435-.002-23.152 0 .001 3.2-.004 6.401.002 9.6h13.407c-.518 3.068-2.34 5.873-4.926 7.6-1.625 1.093-3.492 1.802-5.416 2.139-1.938.33-3.94.373-5.872-.018a14.452 14.452 0 01-5.477-2.365 15.287 15.287 0 01-5.639-7.555c-1.048-3.079-1.056-6.505.005-9.58a15.266 15.266 0 013.57-5.8c1.986-2.033 4.567-3.486 7.348-4.082a14.57 14.57 0 017.223.294 13.333 13.333 0 015.305 3.116c1.512-1.503 3.017-3.016 4.527-4.523.792-.81 1.624-1.586 2.39-2.42-2.292-2.121-4.98-3.827-7.917-4.905-5.287-1.946-11.25-1.987-16.572-.145C14.79 7.891 9.682 12.377 6.85 18.046a24.477 24.477 0 00-2.138 6.184c-1.088 5.343-.33 11.04 2.135 15.908a24.788 24.788 0 006.684 8.215 24.487 24.487 0 008.94 4.508c4.098 1.099 8.46 1.074 12.586.135 3.728-.858 7.256-2.64 10.073-5.24 2.977-2.736 5.1-6.34 6.224-10.214 1.227-4.225 1.396-8.736.627-13.06z"></path>
                    </svg>
                  </div>
                  <div className="button-log">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="#fff"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S.02 4.881.02 3.5C.02 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM5 8H0v16h5V8zm7.982 0H8.014v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0V24H24V13.869c0-7.88-8.922-7.593-11.018-3.714V8z"></path>
                    </svg>

                  </div>
                </div>
                <div className="new">
                  <button className="flip-card__btn">Login!</button>
                </div>
              </form>
            </div>
            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form action="" className="flip-card__form">
                <input type="name" placeholder="Name" className="flip-card__input" />
                <input type="email" placeholder="Email" name="email" className="flip-card__input" />
                <input type="password" placeholder="Password" name="password" className="flip-card__input" />
                <div className="separator">
                  <div></div>
                  <span>OR</span>
                  <div></div>
                </div>
                <div className="login-with">
                  <div onClick={handleButtonClick} className="button-log"></div>
                  <div className="button-log">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56.693"
                      height="56.693"
                      className="icon"
                      enableBackground="new 0 0 56.6934 56.6934"
                      version="1.1"
                      viewBox="0 0 56.693 56.693"
                      xmlSpace="preserve"
                    >
                      <path d="M51.981 24.481c-7.717-.004-15.435-.002-23.152 0 .001 3.2-.004 6.401.002 9.6h13.407c-.518 3.068-2.34 5.873-4.926 7.6-1.625 1.093-3.492 1.802-5.416 2.139-1.938.33-3.94.373-5.872-.018a14.452 14.452 0 01-5.477-2.365 15.287 15.287 0 01-5.639-7.555c-1.048-3.079-1.056-6.505.005-9.58a15.266 15.266 0 013.57-5.8c1.986-2.033 4.567-3.486 7.348-4.082a14.57 14.57 0 017.223.294 13.333 13.333 0 015.305 3.116c1.512-1.503 3.017-3.016 4.527-4.523.792-.81 1.624-1.586 2.39-2.42-2.292-2.121-4.98-3.827-7.917-4.905-5.287-1.946-11.25-1.987-16.572-.145C14.79 7.891 9.682 12.377 6.85 18.046a24.477 24.477 0 00-2.138 6.184c-1.088 5.343-.33 11.04 2.135 15.908a24.788 24.788 0 006.684 8.215 24.487 24.487 0 008.94 4.508c4.098 1.099 8.46 1.074 12.586.135 3.728-.858 7.256-2.64 10.073-5.24 2.977-2.736 5.1-6.34 6.224-10.214 1.227-4.225 1.396-8.736.627-13.06z"></path>
                    </svg>
                  </div>
                  <div className="button-log">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="#fff"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S.02 4.881.02 3.5C.02 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM5 8H0v16h5V8zm7.982 0H8.014v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0V24H24V13.869c0-7.88-8.922-7.593-11.018-3.714V8z"></path>
                    </svg>

                  </div>
                </div>
                <button className="flip-card__btn">Confirm!</button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Newtab;
