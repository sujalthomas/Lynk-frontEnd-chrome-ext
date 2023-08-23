import React, { useState, useEffect } from 'react';
import './Newtab.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import particlesJS from 'particles.js';

const Newtab = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); // Add a state variable for the new password
  const [name, setName] = useState('');
  const [message, setMessage] = useState(''); // Add a state variable for messages
  //const notify = () => toast("Reset code sent to email successfully!");

  const notify_password = () => toast('Reset code successfully sent to your email', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  function handleCardFlip() {
    setIsFlipped(!isFlipped);
  }

  function handleButtonClick(e) {
    e.stopPropagation();
    // Your logic for handling the button click, such as signing in with Apple or Google
  }

  async function handleRegistration() {
    try {
      const response = await fetch('http://127.0.0.1:3000/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'register', name, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Login successful!');
        localStorage.setItem('authToken', data.token);
        //navigate('/dashboard'); // Redirect to the dashboard or other page
        // After successful registration
        window.location.reload();

        //test for now w google
        //chrome.tabs.create({ url: 'https://www.google.com' });
      } else {
        setMessage('Login failed: ' + data.message);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  }


  async function handleLogin(e) {
    e.preventDefault(); // Prevent default behavior
    try {
      const response = await fetch('http://127.0.0.1:3000/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'login', email, password }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Login successful!');
        //chrome.storage.local.set({ authToken: data.token });
        //use this for now
        chrome.storage.local.set({ authToken: data.token });

        chrome.runtime.sendMessage({ type: 'SET_TOKEN', token: data.token }, function (response) {
          console.log(response.message);
          console.log('Token sent to background script.');
        });
        //navigate('/dashboard'); // Redirect to the dashboard or other page

        // after successful login, close the current tab
        //chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        //  chrome.tabs.remove(tabs[0].id);
        //}); 

        //test for now w google
        //chrome.tabs.create({ url: 'https://www.google.com' });
      } else {
        setMessage('Login failed: ' + data.message);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }


  };

  async function handlePasswordResetRequest(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:3000/request-reset-password', {
        method: 'POST',
        mode: 'cors',  // add this line
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Password reset email has been sent.');
        setShowPasswordReset(true);  // Display the password reset form
      } else {
        setMessage('Failed to send password reset email: ' + data.message);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  }

  async function handlePasswordResetWithToken(e, token, newPassword) {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:3000/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Password has been reset successfully.');
      } else {
        setMessage('Failed to reset password: ' + data.message);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  }

  const [showPasswordReset, setShowPasswordReset] = useState(false);

  function togglePasswordResetForm() {
    setShowPasswordReset(prevState => !prevState);
  }

  useEffect(() => {
    // Initialize particles.js
    window.particlesJS('particles-background', {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#ffffff"
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          },
          polygon: {
            nb_sides: 5
          },
          image: {
            src: "img/github.svg",
            width: 100,
            height: 100
          }
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse"
          },
          onclick: {
            enable: true,
            mode: "push"
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3
          },
          repulse: {
            distance: 200,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    });

    return () => {
      // This will be executed when the component is unmounted
      // For example, to remove the particles.js instance when the component is unmounted:
      window.pJSDom = [];
    };
  }, []);



  return (
    <div className="particleWrapper">
      <div id="particles-background" className="vertical-centered-box"></div>
      <div id="particles-foreground" className="vertical-centered-box"></div>

      <div className="vertical-centered-box">

        <div className="wrapper">
          <div className={`card-switch ${isFlipped ? 'flipped' : ''}`}>
            <label className="switch">
              <span onClick={handleCardFlip} className="slider"></span>
              <span className="card-side"></span>
              <div className="flip-card__inner">
                {
                  showPasswordReset ? (
                    <>
                      <div className="flip-card__front"> {/* This is the password reset form */}
                        <div className="title">Reset Password</div>
                        <form action="" className="flip-card__form">
                          <input type="email" placeholder="Email" name="email" className="flip-card__input" value={email} onChange={(e) => setEmail(e.target.value)} />
                          <div className="forgot">
                            <button className="flip-card__btn" onClick={(e) => { handlePasswordResetRequest(e); notify_password(); }}>Reset Password</button>
                          </div>
                        </form>
                        < ToastContainer
                          position="bottom-right"
                          autoClose={5000}
                          hideProgressBar={false}
                          newestOnTop={false}
                          closeOnClick
                          rtl={false}
                          pauseOnFocusLoss
                          draggable
                          pauseOnHover
                          theme="dark"
                        />
                      </div>
                      <div className="flip-card__back">
                        <div className="title">Reset Code</div>
                        <form action="" className="flip-card__form">
                          <input type="password" placeholder="Password" name="password" className="flip-card__input" value={password} onChange={(e) => setNewPassword(e.target.value)} />
                          <input type="password" placeholder="Confirm Password" name="password" className="flip-card__input" value={password} onChange={(e) => setNewPassword(e.target.value)} />
                          <button className="flip-card__btn" onClick={(e) => handlePasswordResetWithToken(e)}>Confirm!</button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flip-card__front">
                        <div className="title">Lynk</div>
                        <form action="" className="flip-card__form">
                          <input type="email" placeholder="Email" name="email" className="flip-card__input" value={email} onChange={(e) => setEmail(e.target.value)} />
                          <input type="password" placeholder="Password" name="password" className="flip-card__input" value={password} onChange={(e) => setPassword(e.target.value)} /><div className="forgot">
                            <span> Forgot password?
                              <a href="#" onClick={(e) => {
                                e.preventDefault();
                                togglePasswordResetForm();
                              }}> Reset here!</a>
                            </span>
                          </div>
                          {/*                         <div className="separator">
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
                        </div> */}
                          <div className="new">
                            <button className="flip-card__btn" onClick={handleLogin}>Login!</button>
                          </div>
                        </form>
                      </div>
                      <div className="flip-card__back">
                        <div className="title">Sign up</div>
                        <form action="" className="flip-card__form">
                          <input type="text" placeholder="Name" className="flip-card__input" value={name} onChange={(e) => setName(e.target.value)} />
                          <input type="email" placeholder="Email" name="email" className="flip-card__input" value={email} onChange={(e) => setEmail(e.target.value)} />
                          <input type="password" placeholder="Password" name="password" className="flip-card__input" value={password} onChange={(e) => setPassword(e.target.value)} />
                          <input type="password" placeholder='Confirm Password' name="password" className="flip-card__input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                          
                          {/* <div className="separator">
                          
                           <div></div>
                            <span>OR</span>
                            <div></div> 
                          </div> */}
                          {/* <div className="login-with">
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
                          </div> */}
                          <button className="flip-card__btn" onClick={handleRegistration}>Confirm!</button>
                        </form>
                      </div>
                    </>
                  )
                }
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newtab;
