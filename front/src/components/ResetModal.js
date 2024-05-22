import React from "react";
import Modal from "./Modal";
import FormField from "./FormField";
import Button from "./Button";
import Title from "./Title";

function ResetModal() {
    const emailRegexp = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')

    function emailValidation (e){
        const emailValue = e.target.value;
        const errorContainer = e.target.parentNode.querySelector('.error');
        if (emailValue.length < 1) {
            errorContainer.innerText = 'This field is required';
        } else {
            if(!emailRegexp.test(emailValue)){
                errorContainer.innerText = 'The email is not valid';
            } else {
                errorContainer.innerText = '';
            }
        }
    }
    async function submitReset (e) {
        e.preventDefault();
        const form = e.target

        const emailValue = form[0].value;
        const errorContainer = e.target.parentNode.querySelector('.error').innerHTML;
        if (emailValue.length < 1) {
            errorContainer.innerText = 'This field is required';
        } else {
            if(!emailRegexp.test(emailValue)){
                errorContainer.innerText = 'The email is not valid';
            } else {
                
                console.log(emailValue);

                const  objData = {
                    email :  emailValue,
                }
                
                const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/send-reset-email`, {
                    method : 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body : JSON.stringify(objData)
                });
                const contentResponse = await response.json();
                console.log(contentResponse);

                if(response.ok){
                    document.querySelector('.reset-success').style.display = "block";
                } else{
                    document.querySelector('.reset-error').style.display = "block";
                }
            }
        }
    } 

    return(
        <React.Fragment>
       <Modal className="reset-modal" content={
        <div className="flex-center-column">
            <Title value='Reset password'/>
            <p className="indication">Please enter your email address to receive a reset password email</p>
            <form id="login" className="flex-center-column" onSubmit={submitReset}>
                <div className="form-control">
                    <FormField fieldTagName="input" type="email" placeholder="Email" id="email" onChange={emailValidation}/>
                    <p className='error error-email'></p>
                </div>
                <div className="form-control">
                    <Button tagName="input" type="submit" btnValue="Send"/>       
                </div>
            </form>
            
        </div>
       }/> 

       <Modal className="error-modal reset-error" content={
            <div className="flex-center-column">
                <Title value='Error'/>    
                <p className="error-msg">The provided email address does not exist !</p>
                <Button tagName="button" btnValue="Close" onClick={(e) => {e.target.parentNode.parentNode.parentNode.style.display = "none";}}/>       
            </div>
        }/>
        <Modal className="success-modal reset-success" content={
            <div className="flex-center-column">
                <Title value='Success'/>    
                <p className="success-msg">An email containing the password has been sent to you. Please check your mails </p>
                <Button tagName="button" btnValue="Close" onClick={(e) => {e.target.parentNode.parentNode.parentNode.style.display = "none";}}/>       
            </div>
        }/>
</React.Fragment>

    )
}


export default ResetModal