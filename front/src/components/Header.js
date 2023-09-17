import React, { useEffect }  from "react";
import Button from "../components/Button";
import  "../styles/Header.css";

function Header() {
  let loginModal = 0;
  let signupModal = 0;

  useEffect(() =>{   
    loginModal = document.querySelector('.backdrop.login-modal')
    signupModal = document.querySelector('.backdrop.signup-modal')
  })
  
  function openLoginModal(){
    console.log(loginModal);
    loginModal.style.display = "block"
  }
  
  function openSignupModal(){
    console.log(signupModal);
    signupModal.style.display = "block"
  }

  return (
    <header>
      <div className='header-content'>
        <a href="/">
          <h1 className='logo'>FastFolio</h1>
        </a>
        <nav>
          <a className='nav-login' onClick={openLoginModal} href="#">
            Login
          </a>
          <Button tagName="a" onClick={openSignupModal} btnValue="Sign up" href="#"></Button>

        </nav>
      </div>
    </header>
  );
}

export default Header;
