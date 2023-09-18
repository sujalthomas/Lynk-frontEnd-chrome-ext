import React, { useState, useEffect } from 'react';
import './Newtab.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import particlesJS from 'particles.js';
import { BrowserRouter as Router } from 'react-router-dom';

const Newtab = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); // Add a state variable for the new password
  const [otCode, setOTCode] = useState(''); // Add a state variable for the new password
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  function togglePasswordResetForm() {
    setShowPasswordReset(prevState => !prevState);
  }


  function handleCardFlip() {
    setIsFlipped(!isFlipped);
  }


  async function handleRegistration(e) {
    e.preventDefault();
    // Input validation
    if (!email) {
      toast.error("Email is required!");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!newPassword) {
      toast.error("Password is required!");
      return;
    }
    if (!newPassword) {
      toast.error('Confirm password is required!')
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('https://lynk.up.railway.app/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Registration successful! Please check your email for a verification code.');
      } else {
        toast.error('Registration failed: ' + data.message);
      }
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  }


  async function handleRegistrationVerify(e) {
    e.preventDefault();
    // Input validation
    if (!email) {
      toast.error("Email is required!");
      return;
    }
    if (!otCode) {
      toast.error("One-time code is required!");
      return;
    }

    try {
      const response = await fetch('https://lynk.up.railway.app/verify', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: otCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(`Error: ${response.status} - ${response.statusText}`);
      }
      if (data.success) {
        toast.success(data.message + ' Account has been verified successfully.');
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  }


  async function handleLogin(e) {
    e.preventDefault();
    // Input validation
    if (!email) {
      toast.error("Email is required!");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!password) {
      toast.error("Password is required!");
      return;
    }

    try {
      const response = await fetch('https://lynk.up.railway.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Login successful!');
        chrome.storage.local.set({ authToken: data.token });

        chrome.runtime.sendMessage({ type: 'SET_TOKEN', token: data.token }, function (response) {
          if (chrome.runtime.lastError) {
            toast.error('Error sending token to background script: ' + chrome.runtime.lastError.message);
            return;
          }

          if (response.error) {
            toast.error('Error sending token to background script: ' + response.message);
          } else {
            window.location.href = "https://lynk.up.railway.app/";
          }
        });
      } else {
        // Specific error messages based on backend response
        switch (response.status) {
          case 400:
            toast.error('Login failed: Missing email or password.');
            break;
          case 401:
            toast.error('Login failed: Incorrect email or password.');
            break;
          case 403:
            toast.error('Login failed: Your account is not active. Please verify your email or contact support.');
            break;
          case 404:
            toast.error('Login failed: No account found with this email address. Please sign up or check your email address.');
            break;
          default:
            toast.error('Login failed: ' + data.message);
            break;
        }
      }
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
  }





  async function handlePasswordReset(e) {
    e.preventDefault();
    // Input validation
    if (!email) {
      toast.error("Email is required!");
      return;
    }
    if (!otCode) {
      toast.error("One-time code is required!");
      return;
    }
    if (!newPassword) {
      toast.error("New password is required!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('https://lynk.up.railway.app/reset-password', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, code: otCode, newPassword: newPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(`Error: ${response.status} - ${response.statusText}`);
      }
      if (data.success) {
        toast.success(data.message + ' Password has been reset successfully.');
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('An error occurred: ' + error.message);
    }
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
    <Router>
      <div className="particleWrapper">
        <div id="particles-background" className="vertical-centered-box"></div>
        <div id="particles-foreground" className="vertical-centered-box"></div>

        <div className="vertical-centered-box">

          <div className="wrapper">
            <ToastContainer position="top-center" />
            <div className={`card-switch ${isFlipped ? 'flipped' : ''}`}>
              <label className="switch">
                <span onClick={handleCardFlip} className="card-side"></span>
                <span onClick={handleCardFlip} className="slider"></span>
                <span onClick={handleCardFlip} className="card-side"></span>
                <div className="flip-card__inner">
                  {
                    showPasswordReset ? (
                      <>
                        <div className="flip-card__front"> {/* This is the password reset form */}
                          <div className="title">Reset Password</div>
                          <form action="" className="flip-card__form">
                            <input type="email" placeholder="Email" name="email" className="flip-card__input" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <div className="forgot">
                              <button className="flip-card__btn" onClick={(e) => { handlePasswordResetRequest(e); }}>Reset Password</button>
                            </div>
                          </form>
                          <form action="" className="flip-card__form">
                            <input type="email" placeholder="Email" name="email" className="flip-card__input" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input
                              type="text"
                              placeholder="One Time Code"
                              name="password"
                              className="flip-card__input"
                              value={otCode}
                              onChange={(e) => setOTCode(e.target.value)}
                            />
                            <input
                              type="password"
                              placeholder="Password"
                              name="password"
                              className="flip-card__input"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                              type="password"
                              placeholder="Confirm Password"
                              name="confirmPassword"
                              className="flip-card__input"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            <button className="flip-card__btn" onClick={(e) => handlePasswordReset(e)}>Confirm!</button>
                          </form>
                        </div>


                      </>
                    ) : (
                      <>
                        <div className="flip-card__front">
                          <div className="title">Lynk</div>
                          <form action="" className="flip-card__form">
                            <input type="email" placeholder="Email" name="email" className="flip-card__input" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password" name="password" className="flip-card__input" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <div className="forgot">
                              <span> Forgot password?
                                <a href="#" onClick={(e) => {
                                  e.preventDefault();
                                  togglePasswordResetForm();
                                }}> Reset here!</a>
                              </span>
                            </div>

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
                            <input
                              type="password"
                              placeholder="Password"
                              name="password"
                              className="flip-card__input"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                              type="password"
                              placeholder="Confirm Password"
                              name="confirmPassword"
                              className="flip-card__input"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            <button className="flip-card__btn" onClick={handleRegistration}>Confirm!</button>
                          </form>
                          <form action="" className="flip-card__form">
                            <input
                              type="text"
                              placeholder="One Time Code"
                              name="password"
                              className="flip-card__input"
                              value={otCode}
                              onChange={(e) => setOTCode(e.target.value)}
                            />
                            <button className="flip-card__btn" onClick={(e) => handleRegistrationVerify(e)}>Verify!</button>
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
    </Router >
  );
};

export default Newtab;









