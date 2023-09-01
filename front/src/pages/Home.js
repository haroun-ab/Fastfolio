import React, { useEffect }  from "react";
import '../styles/home.css'
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Title from "../components/Title";
import FormField from "../components/FormField";
import {FaBolt, FaLightbulb, FaDollarSign} from 'react-icons/fa'

function App() {
  ////////////////////////////////////////////////////////////////////////
 // Apparition et disparition des modals de connexion et d'inscription //
////////////////////////////////////////////////////////////////////////
    let loginModal = 0;
    let signupModal = 0;

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

  function closeLoginModal(){
    loginModal.style.display = "none"
  }

  function closeSignupModal(){
    signupModal.style.display = "none"
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

    useEffect(() =>{
         ///////////////////////////////////////////////////////////////
        ////// Vérification et envoie des données d'inscription ///////
       ///////////////////////////////////////////////////////////////
        document.querySelector('#signup .button').disabled = true;
        document.querySelector('#signup .button').style.opacity = 0.66;
        
        // Regexp de vérification conformité des données entrées
        const nameRegexp = new RegExp('^[A-Za-z]{1,}$')
        const emailRegexp = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
        const passwordRegexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")

        let isSignupFirstNameConform = 0;
        let isSignupLastNameConform = 0;
        let isSignupEmailConform = 0;
        let isSignupPasswordConform = 0;

        let signupFirstName = '';
        let signupLastName = '';
        let signupEmail = '';
        let signupPassword = '';
        
        // Envoie du formulaire d'inscription
        const signupForm = document.querySelector('#signup');
        for(let i = 0; signupForm.length > i ;i++){
            signupForm[i].onchange = () => {
                if(signupForm[i].id == 'firstname'){
                    signupFirstName = signupForm[i].value.charAt(0).toUpperCase() + signupForm[i].value.slice(1);
                    if (signupFirstName < 1) {
                        isSignupFirstNameConform = false
                        document.querySelector('#signup p.error-firstname').innerHTML = 'This field is required';
                    }else{
                        if (!nameRegexp.test(signupFirstName)) {
                            isSignupFirstNameConform = false
                            document.querySelector('#signup p.error-firstname').innerHTML = 'Only letters are allowed in the First name';
                        } else {
                            isSignupFirstNameConform = true
                            document.querySelector('#signup p.error-firstname').innerHTML = '';
                        }
                    }
                }

                if(signupForm[i].id == 'lastname'){
                    signupLastName = signupForm[i].value.charAt(0).toUpperCase() + signupForm[i].value.slice(1);
                    if (signupLastName.length < 1) {
                        isSignupLastNameConform = false
                        document.querySelector('#signup p.error-lastname').innerHTML = 'This field is required';
                    } else {
                        if (!nameRegexp.test(signupLastName)) {
                            isSignupLastNameConform = false
                            document.querySelector('#signup p.error-lastname').innerHTML = 'Only letters are allowed in the Last name';
                        } else {
                            isSignupLastNameConform = true
                            document.querySelector('#signup p.error-lastname').innerHTML = '';
                        }
                    }
                }

                if(signupForm[i].id == 'email'){
                    
                    signupEmail = signupForm[i].value;
                    
                    if (signupEmail.length < 1) {
                        isSignupEmailConform = false
                        document.querySelector('#signup p.error-email').innerHTML = 'This field is required';
                    } else {
                        if (!emailRegexp.test(signupEmail)) {
                            isSignupEmailConform = false
                            document.querySelector('#signup p.error-email').innerHTML = 'The email is not valid';
                        } else {
                            isSignupEmailConform = true
                            document.querySelector('#signup p.error-email').innerHTML = '';
                        }
                    }
                }

                if(signupForm[i].id == 'password'){
                    signupPassword = signupForm[i].value;
                    console.log(signupForm[i]);
                    signupForm[i].innerHTML += '&#128712;'

                    if (signupPassword.length < 1) {
                        isSignupPasswordConform = false
                        document.querySelector('#signup p.error-password').innerHTML = 'This field is required';
                    } else {
                        if (!passwordRegexp.test(signupPassword)) {
                            isSignupPasswordConform = false
                            document.querySelector('#signup p.error-password').innerHTML = 'The password is invalid';
                        } else {
                            isSignupPasswordConform = true
                            document.querySelector('#signup p.error-password').innerHTML = '';
                        }
                    }
                }


                console.log(isSignupFirstNameConform+isSignupLastNameConform+isSignupEmailConform+isSignupPasswordConform);

                if (isSignupFirstNameConform == true && isSignupLastNameConform == true && isSignupEmailConform == true && isSignupPasswordConform == true){
                    document.querySelector('#signup .button').disabled = false;
                    document.querySelector('#signup .button').style.opacity = 1;

                    signupForm.onsubmit = async (e) => {            
                        e.preventDefault();
                        const dataObj = {
                            firstName: signupFirstName,
                            lastName: signupLastName,
                            email: signupEmail,
                            password: signupPassword
                        };
                        
                        try {
                            const response = await fetch('http://127.0.0.1:8000/api/signup', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dataObj)
                            });
                            
                            const content = await response.json();
                            console.log(content);
                            console.log(response.status);
                        } catch (error) {
                            console.error('Une erreur est survenue', error);
                        }
                    };
                    
                  } else{
                    document.querySelector('#signup .button').disabled = true;
                    document.querySelector('#signup .button').style.opacity = 0.66; 
                  }
            }
        }


  
          ///////////////////////////////////////////
         //// Envoie du formulaire de connexion ////
        ///////////////////////////////////////////

        document.querySelector('#login .button').disabled = true;
        document.querySelector('#login .button').style.opacity = 0.66;
        

        let isLoginPasswordConform = 0;
        let isLoginEmailConform = 0;
        let loginEmail = "";
        let loginPassword = "";
        
        const loginForm = document.querySelector('#login');

        for(let i = 0; loginForm.length > i ;i++){
            
            loginForm[i].onchange = () => {
                if(loginForm[i].id == 'email'){
                    loginEmail = loginForm[i].value
                    if (loginEmail.length < 1) {
                        isLoginEmailConform = false
                        document.querySelector('#login p.error-email').innerHTML = 'This field is required';
                    } else {
                        if(!emailRegexp.test(loginEmail)){
                            isLoginEmailConform = false
                            document.querySelector('#login p.error-email').innerHTML = 'The email is not valid';
                        } else {
                            isLoginEmailConform = true
                            document.querySelector('#login p.error-email').innerHTML = '';
                        }
                    }
                }
                
                if (loginForm[i].id == 'password') {
                    loginPassword = loginForm[i].value
                    if (loginPassword.length < 1) {
                        isLoginPasswordConform = false
                        document.querySelector('#login p.error-password').innerHTML = 'This field is required';
                    } else {
                        isLoginPasswordConform = true
                        document.querySelector('#login p.error-password').innerHTML = '';
                    }
                } 

                console.log(isLoginEmailConform+isLoginPasswordConform)
        
                if (isLoginEmailConform == true && isLoginPasswordConform == true){
                    document.querySelector('#login .button').disabled = false;
                    document.querySelector('#login .button').style.opacity = 1;
    
                    loginForm.onsubmit = async (e) => {            
                        e.preventDefault();
                        const dataObj = {
                            email : loginEmail,
                            password : loginPassword
                        }
                        
                        try {
                            
                            // vérification des identifiants de connexion !
                            const response = await fetch('http://127.0.0.1:8000/api/login', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dataObj)
                            });
                            
                            const content = await response.json();
                            console.log(response.status);
                            console.log(content);
                            // récupération du token si connexion réussie !
                            if(response.status == 200) {
                                const response = await fetch('http://127.0.0.1:8000/api/login_check', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dataObj)
                            });
                            const tokenResponse = await response.json();
                            console.log(tokenResponse.token);
                            }

                            // stocker le token dans les cookies
                            
                        } catch (error) {
                            console.error('Une erreur est survenue', error);
                        }
                    }
                } else{
                    document.querySelector('#login .button').disabled = true;
                    document.querySelector('#login .button').style.opacity = 0.66; 
                }
            }
        }     
    })

    return (
    <React.Fragment>
        <Header/>
        <main>
            <section className="bg">
                <div className="content">
                    <h2>Sign up and create your porfolio for free in less than 10 minutes&nbsp;!</h2>
                    <Button tagName="a" btnValue="Sign up" href='#' onClick={openSignupModal}/>
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
                                    <Button tagName="a" btnValue="Login" href="#" onClick={openLoginModal}></Button>
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
        <div className="backdrop login-modal">
            <div className="modal">
                <img src="/xmark.svg" className="close-modal-btn" onClick={closeLoginModal}/>
                <div className="flex-center-column">
                    <Title value='Authentication'/>
                    <p>If you have a Fastfolio account, use your email to sign in.</p>
                    <form id="login" className="flex-center-column">
                        <div className="form-control">
                            <FormField fieldTagName="input" type="email" placeholder="Email" id="email"/>
                            <p className='error error-email'></p>
                        </div>
                        <div className="form-control">
                            <FormField fieldTagName="input" type="password" placeholder="Password" id="password"/>
                            <p className='error error-password'></p>
                        </div>
                        <div className="form-control">

                            <Button tagName="input" type="submit" btnValue="Login"/>       
                        </div>
                    </form>
                    <p>If you have an account, <a className="link" href="#" onClick={openSignupModal}>sign up !</a></p>
                </div>
            </div>
        </div>
        <div className="backdrop signup-modal">
            <div className="modal">
            <img src="/xmark.svg" className="close-modal-btn" onClick={closeSignupModal}/>
                <div className="flex-center-column">
                    <Title value="Sign up"/>
                    <p>If you don’t have a Fastfolio account, use your email to sign up.</p>
                    <form id="signup" className="flex-center-column">
                        <div className="form-control">
                            <FormField fieldTagName="input" type="text" placeholder="First name" id="firstname"/>
                            <p className='error error-firstname'></p>
                        </div>
                        <div className="form-control">
                            <FormField fieldTagName="input" type="text" placeholder="Last name" id="lastname"/>
                            <p className='error error-lastname'></p>
                        </div>
                        <div className="form-control">
                            <FormField fieldTagName="input" type="email" placeholder="Email" id="email"/>
                            <p className='error error-email'></p>
                        </div>
                        <div className="form-control">
                            <FormField fieldTagName="input" type="password" placeholder="Password" id="password"/>
                            <p className='error error-password'></p>
                            <p className="password-info">&#128712;<span>At least :<br/>- 8 characters <br/>- 1 lowercase letter<br/>- 1 uppercase letter,<br/>- 1 special character (@$!%*?&)</span></p>
                        </div>
                        <div className="form-control">
                            <Button tagName="input" type="submit" btnValue="Sign up"/>   
                        </div>
                                  
                    </form>
                    <p>If you don’t have an account, <a className="link" href="#" onClick={openLoginModal}>sign in !</a></p>

                </div>                
            </div>
        </div>
    </React.Fragment>
    );
  }
  
  export default App;
  