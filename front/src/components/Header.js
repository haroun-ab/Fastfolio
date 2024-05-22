import React, { useEffect, useState}  from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import  "../styles/components/Header.css";
import {FaChevronUp, FaCog, FaPowerOff, FaShare, FaTh} from "react-icons/fa";
import Signup from "./Signup";
import Login from "./Login";
import Share from "./Share";
import {setTheme} from "../common";



function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  async function isHeLoggedIn() {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/is-logged-in`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
    });
    const contentResponse = await response.json();
    console.log(contentResponse);
    
    return [response.ok, contentResponse];
  }
  
  let loginModal = 0;
  let signupModal = 0;
  let shareModal = 0;
  function openLoginModal(){
    console.log(loginModal);
    loginModal.style.display = "block"
  }
  
  function openSignupModal(){
    console.log(signupModal);
    signupModal.style.display = "block"
  } 

  function openShareModal(){
    console.log(shareModal);
    shareModal.style.display = "block"
  } 

  
  useEffect(() => {
    loginModal = document.querySelector('.backdrop.login-modal')
    signupModal = document.querySelector('.backdrop.signup-modal')
    shareModal = document.querySelector('.backdrop.share-modal')
  });

  useEffect(() => {
    setTheme();
    async function checkLoginStatus() {
      const isLoggedIn = await isHeLoggedIn();
      setUserId(isLoggedIn[1]["userId"])
      setLoggedIn(isLoggedIn[0])
      setUserImage(isLoggedIn[1]["img"])

      console.log(location.pathname.split('/')[1]);
      if (!isLoggedIn[0] && location.pathname.split('/')[1] != "portfolio" && location.pathname.split('/')[1] != "reset-password") {
        navigate('/');
      } else if (isLoggedIn[0] && location.pathname == "/") {
        navigate('/dashboard');
      }
    }
    checkLoginStatus();
    console.log(userId);
  }, []);

  async function logOut(){
    localStorage.clear();
    navigate('/');
}
// function openShareModal() {
//   setShareOpen(true);
// }
// function closeShareModal() {
//   setShareOpen(true);
// }
// Afficher le menu du header
  function displayMenu() {
    if (isMenuOpen) {
      setMenuOpen(false);
    } else{
      setMenuOpen(true);
    }
  }

  return (
    <React.Fragment>
      <header>

      
        <div className='header-content'>
        {loggedIn? 

          <a href="/dashboard">
            <h1 className='logo'>Fastfolio</h1>
          </a>
          : 
          <a href="/">
          <h1 className='logo'>Fastfolio</h1>
        </a>}

          
        {
          {
            null : "",
          true :
          <nav>
        {isMenuOpen ?

            <div className='nav-menu-container' onClick={displayMenu}>
              <img className="nav-img" src={process.env.REACT_APP_DOMAIN_API + "/uploads/" + userImage}/>
              
                <div className="nav-menu selected">
                  <FaChevronUp/>
                  <div className="nav-menu-content">
                  <a className="nav-menu-link" href="/dashboard">
                      <FaTh/>
                      <span>Dashboard</span>
                    </a>
                    <span className="nav-menu-link" onClick={openShareModal} >
                      <FaShare/>
                      <span>Share</span>
                    </span>
                    <a className="nav-menu-link" href="/settings">
                      <FaCog/>
                      <span>Settings</span>
                    </a>
                    <a className="nav-menu-link" onClick={logOut} >
                      <FaPowerOff/>
                      <span>Log out</span>
                    </a>

                  </div> 
                </div>
            </div>
          :   
          <div className='nav-menu-container' onClick={displayMenu}>
              <img className="nav-img" src={process.env.REACT_APP_DOMAIN_API + "/uploads/" + userImage}/>
          <div className="nav-menu">
            <FaChevronUp/>
          </div>
      </div>
      }
          </nav> ,
          false :  <nav>
          <a className='nav-login' onClick={openLoginModal} href="#">
            Login
          </a>
          <Button tagName="a" onClick={openSignupModal} btnValue="Sign up" href="#"></Button>
        </nav> 
          } [loggedIn]
        }

        </div>
        {
        userId != null ? <Share userId={userId}/>
        : 
        "" 
        }
        
      </header>
      {/* <Signup/>
        <Login/> */}
        {/* {isOnline && isShareOpen ? <Share/> : "nooon"} */}
      {!loggedIn ? 
      <React.Fragment>
        <Signup/>
        <Login/>
      </React.Fragment>
      :
        ""
    }
    </React.Fragment>
  
  );
}

export default Header;
