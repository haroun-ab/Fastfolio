import React, {useEffect, useState} from "react";
import FormField from "./FormField";
import Modal from "./Modal";
import Title from "./Title";
import Button from "./Button";
import {useNavigate} from 'react-router-dom'
import ResetModal from "./ResetModal";

function Login () {
    const navigate = useNavigate();
    const [userId, setUserId] = useState();
  ////////////////////////////////////////////////////////////////////////
 // Apparition et disparition des modals de connexion et d'inscription //
////////////////////////////////////////////////////////////////////////
let loginModal = "";
let signupModal = "";
let errorModal = "";

useEffect(() =>{   
loginModal = document.querySelector('.backdrop.login-modal');
signupModal = document.querySelector('.backdrop.signup-modal');
})

function openSignupModal(){
signupModal.style.display = "block"
loginModal.style.display = "none"
}

function closeModal(event){
    event.target.parentNode.parentNode.parentNode.style.display = "none";
}

useEffect (() => {
          ///////////////////////////////////////////
         //// Envoie du formulaire de connexion ////
        ///////////////////////////////////////////
        const emailRegexp = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')

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
                            const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/login`, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dataObj)
                            });
                            
                            const contentResponse = await response.json();
                            console.log(response.status);
                            console.log(contentResponse);
                            // récupération du token si connexion réussie !
                            if(response.status ==  "200") {
                                localStorage.removeItem('jwt');
                                localStorage.setItem('jwt', contentResponse.token);
                                const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/get-settings`, {
                                method: 'GET',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
                                }
                            });
                            const contentBgResponse = await response.json();
                            console.log(contentBgResponse);
                            localStorage.setItem('bgId', contentBgResponse["bgId"])
                            localStorage.setItem('theme', contentBgResponse["theme"])    
                            navigate(`/dashboard`);
                            } else {    
                                errorModal = document.querySelector('.backdrop.error-modal.login-error');
                                errorModal.querySelector('.backdrop.error-modal.login-error .error-msg').innerHTML = "Email or password are not correct."
                                errorModal.style.display = "block"
                            }

                            
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

    return(
        <React.Fragment>

        <Modal className="login-modal" content={
            <React.Fragment>
                <div className="flex-center-column">
                    <Title value='Authentication'/>
                    <p className="indication">If you have a Fastfolio account, use your email to sign in.</p>
                    <form id="login" className="flex-center-column">
                        <div className="form-control">
                            <FormField fieldTagName="input" type="email" placeholder="Email" id="email"/>
                            <p className='error error-email'></p>
                        </div>
                        <div className="form-control">
                            <FormField fieldTagName="input" type="password" placeholder="Password" id="password"/>
                            <p className="reset-password" onClick={() => document.querySelector('.reset-modal').style.display = "block"}>Forgot password ?</p>
                            <p className='error error-password'></p>
                        </div>
                        <div className="form-control">
                            <Button tagName="input" type="submit" btnValue="Login"/>       
                        </div>
                    </form>
                    <p className="indication">If you have an account, <a className="link" href="#" onClick={openSignupModal}>sign up !</a></p>
                </div>
            </React.Fragment>
        }/>

            <Modal className="error-modal login-error" content={
                <React.Fragment>
                    <div className="flex-center-column">
                        <Title value='Error'/>    
                        <p className="error-msg">error</p>
                        <Button tagName="button" btnValue="Close" onClick={closeModal}/>       
                    </div>
                </React.Fragment>
            }/>
            <ResetModal/>

            </React.Fragment>
    );
}

export default Login;