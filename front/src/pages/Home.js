import React, { useEffect }  from "react";
import '../styles/home.css'
import "../styles/Modal.css";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";

import {FaBolt, FaLightbulb, FaDollarSign} from 'react-icons/fa'
import Login from "./Login";
import Signup from "./Signup";
function App() {

  ////////////////////////////////////////////////////////////////////////
 // Apparition et disparition des modals de connexion et d'inscription //
////////////////////////////////////////////////////////////////////////
let loginModal = "";
let signupModal = "";

useEffect(() =>{   
loginModal = document.querySelector('.backdrop.login-modal');
signupModal = document.querySelector('.backdrop.signup-modal');
})

function openLoginModal(){
loginModal.style.display = "block"
signupModal.style.display = "none"
}

function openSignupModal(){
signupModal.style.display = "block"
loginModal.style.display = "none"
}

    /////////////////////////////////////////////////////////
   ////////////////// Animation au scroll //////////////////
  /////////////////////////////////////////////////////////
  function isVisible(element) {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = document.documentElement.clientHeight;
    console.log('position :'+ elementPosition);
    console.log('window :'+ windowHeight);
    return elementPosition <= windowHeight
}

function animSettings(element) {
    let result = Object.prototype.toString.call(element);
    if (result === '[object HTMLCollection]' || result === '[object NodeList]'){
        for (let i = 0; i < element.length; i++) {
            const el = element[i];
            if (isVisible(el)){
                console.log(i);
                console.log(isVisible(el));
                    el.classList.add('appear-anim-active')
            } else{
                console.log(isVisible(el));
            }
        }
    } else {
        if (isVisible(element)){
            element.classList.add('appear-anim-active')
        }    
    }
}
    window.onscroll = () =>{
        const elementArr = document.querySelectorAll('section.preface .preface-div');
        animSettings(elementArr)

        const contact = document.querySelector('.bg:nth-child(4) .content');
        animSettings(contact);       
    } 

   

    return (
    <div>
        <Header/>
        <main>
            <section className="bg">
                <div className="content">
                    <h2>Sign up and create your porfolio for free in less than 10 minutes&nbsp;!</h2>
                    <Button tagName="a" btnValue="Get started on free !" href='#' onClick={openSignupModal}/>
                </div>
            </section>
            <section className="middle">
                <div className="content">
                    <img className="illustration" src="illustration-2.gif" draggable="false"/>
                    <div className="text">
                        <div className="catchphrase">
                            <span>Create your portfolio in two clicks</span> <br/>
                            <span>and all this,</span>   
                            <span>FOR FREE !</span>
                        </div>
                        <div className="login-signup">
                            <div className="login">
                                <span>If you have an account,</span>
                                <Button tagName="a" btnValue="Login" href="/login" onClick={openLoginModal}></Button>
                            </div>
                            <div className="signup">
                                <span>else,</span>
                                <Button tagName="a" btnValue="Sign up" href="#" onClick={openSignupModal}></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg preface">
                <div className="content">
                    <h2>Why use FastFolio ? Because it's&nbsp;:</h2>
                    <div className="preface-container">
                        <div className="preface-div">
                            <FaBolt/>
                            <h3>Rapid</h3>
                            <p>It's possible to create a portfolio in less than 10 minutes&nbsp;!</p>
                        </div>
                        <div className="preface-div"> 
                            <FaLightbulb/>
                            <h3>Intuitive</h3>
                            <p>It's simplistic and polished ergonomics make it very easy to use.</p>
                        </div>
                        <div className="preface-div">
                            <FaDollarSign/>
                            <h3>Free</h3>
                            <p>FastFolio© is 100% free&nbsp;! What are you waiting to create your account&nbsp;?!</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg">
                <div className="content">
                    <h2>Do you have any suggestions for us to improve our services&nbsp;?</h2>
                    <Button tagName="a" btnValue="Contact us"/>
                </div>
            </section>
        </main>
        <Footer/>
        <Login/>
        <Signup/>
    </div>
    );
  }
  
  export default App;
  