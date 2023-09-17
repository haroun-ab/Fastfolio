import React, {useEffect} from "react";
import Title from "../components/Title";
import FormField from "../components/FormField";
import Modal from "../components/Modal";
import Button from "../components/Button";

function Signup() {

    let loginModal = 0;
    let signupModal = 0;
    let errorModal = 0;
    let successModal = 0;

    useEffect(() =>{   
    loginModal = document.querySelector('.backdrop.login-modal');
    signupModal = document.querySelector('.backdrop.signup-modal');
    })

    function openLoginModal(){
    loginModal.style.display = "block"
    signupModal.style.display = "none"
    }

    function closeModal(event){
        event.target.parentNode.parentNode.parentNode.style.display = "none";
    }

    function goToSignIn(event) {
        closeModal(event);
        document.querySelector('#signup').reset();
        document.querySelector('#login').reset();
        openLoginModal();
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
        let isSignupBirthDateConform = 0
       let isSignupEmailConform = 0;
       let isSignupPasswordConform = 0;

       let signupFirstName = '';
       let signupLastName = '';
       let signupBirthDate = '';
       let signupEmail = '';
       let signupPassword = '';
       
       const fn = document.querySelector('#firstname');

       // Envoie du formulaire d'inscription
       const signupForm = document.querySelector('#signup');
       for(let i = 0; signupForm.length > i ;i++){
        if(signupForm[i].id == 'firstname' || signupForm[i].id == 'lastname'){
            signupForm[i].onkeyup = () => {
                signupForm[i].value = signupForm[i].value.charAt(0).toUpperCase() + signupForm[i].value.slice(1);            
            }
        }
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
               if(signupForm[i].id == 'birthdate'){
                signupBirthDate = signupForm[i].value
                let date = new Date(signupBirthDate)
                console.log(date.getFullYear());

                let now = new Date(Date.now())

                console.log();

                if (Number.isNaN(Date.parse(signupBirthDate))) {
                    isSignupBirthDateConform = false
                    document.querySelector('#signup p.error-birthdate').innerHTML = 'This field is required';
                } else {
                    if(now.getFullYear() - date.getFullYear() < 3){
                        isSignupBirthDateConform = false
                        document.querySelector('#signup p.error-birthdate').innerHTML = 'You must be over 3 years old';
                    } else{
                        isSignupBirthDateConform = true
                        document.querySelector('#signup p.error-birthdate').innerHTML = '';
                    
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
                       console.log('empty');
                       document.querySelector('#signup p.error-password').innerHTML = 'This field is required';
                       document.querySelector('.password-info').style.cssText = "color : #cd0000 !important;"
                       document.querySelector('.password-info span').style.cssText = "color : #cd0000 !important;"
                   } else {
                       if (!passwordRegexp.test(signupPassword)) {
                           isSignupPasswordConform = false
                           document.querySelector('#signup p.error-password').innerHTML = 'The password is invalid';
                           document.querySelector('.password-info').style.cssText = "color : #cd0000 !important;"
                           document.querySelector('.password-info span').style.cssText = "color : #cd0000 !important;"


                       } else {
                           isSignupPasswordConform = true
                           document.querySelector('#signup p.error-password').innerHTML = '';
                           document.querySelector('.password-info').style.cssText = "color : var(--grey) !important !important;"
                           document.querySelector('.password-info span').style.cssText = "color : var(--grey) !important !important;"
                       }
                   }
               }


               console.log(isSignupFirstNameConform+isSignupLastNameConform+isSignupEmailConform+isSignupPasswordConform+isSignupBirthDateConform);

               if (isSignupFirstNameConform && isSignupLastNameConform && isSignupEmailConform && isSignupPasswordConform && isSignupBirthDateConform){
                   document.querySelector('#signup .button').disabled = false;
                   document.querySelector('#signup .button').style.opacity = 1;

                   signupForm.onsubmit = async (e) => {            
                       e.preventDefault();
                       const dataObj = {
                           firstName: signupFirstName,
                           lastName: signupLastName,
                           birthDate: signupBirthDate,
                           email: signupEmail,
                           password: signupPassword
                       };
                       
                       try {
                           const response = await fetch('https://127.0.0.1:8000/api/signup', {
                               method: 'POST',
                               headers: {
                                   'Accept': 'application/json',
                                   'Content-Type': 'application/json'
                               },
                               body: JSON.stringify(dataObj)
                           });
                           
                           const contentResponse = await response.json();
                           console.log(contentResponse);
                           console.log(response.status);
                        if (response.status == 201) {
                            successModal = document.querySelector('.backdrop.success-modal.signup-success');
                            successModal.querySelector('.backdrop.success-modal.signup-success .success-msg').innerHTML = contentResponse.message
                            successModal.style.display = "block"
                        } else {
                            errorModal = document.querySelector('.backdrop.error-modal.signup-error');
                            errorModal.querySelector('.backdrop.error-modal.signup-error .error-msg').innerHTML = contentResponse.error
                            errorModal.style.display = "block"
                        }
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


 
        
   })
return (
    <React.Fragment>

<Modal className="signup-modal" content={    
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
                <FormField fieldTagName="input" type="date" placeholder="birth date" id="birthdate"/>
                <p className='error error-birthdate'></p>
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
}/>

    <Modal className="error-modal signup-error" closable="yes" content={
        <React.Fragment>
            
            <div className="flex-center-column">
                <Title value='Error'/>    
                <p className="error-msg">error</p>
                <Button tagName="button" btnValue="Close" onClick={closeModal}/>       
            </div>
        </React.Fragment>
    }/>

    <Modal className="success-modal signup-success" closable="no" content={
        <React.Fragment>
            <div className="flex-center-column">
                <Title value='Success'/>    
                <p className="success-msg">Success</p>
                <Button tagName="button" btnValue="Sign in" onClick={goToSignIn}/>       
            </div>
        </React.Fragment>
    }/>
    </React.Fragment>

);

}

export default Signup;
