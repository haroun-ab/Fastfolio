import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/pages/edit.css'
import FormField from "../components/FormField";
import Title from "../components/Title";
import Button from "../components/Button";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal";


function ResetPassword() {  
    const [isTokenValid, setIsTokenValid] = useState(null);
    const [email, setEmail] = useState(null);
    const [userId, setUserId] = useState(null);

    const passwordRegexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
    const {token} = useParams();

    async function isResetTokenValid() {
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/is-reset-token-valid`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(token)
        });
        const contentResponse = await response.json();
        setIsTokenValid(response.ok);
        setEmail(contentResponse['email']);
    }
    // 62a0b91a9b98a7ec19f27e42c13de207655bcb49b6518
    // 62a0b91a9b98a7ec19f27e42c13de207655bb9573f889
    useEffect(() => {
        isResetTokenValid() 
    }, [])

    function handlePasswordChange () {
        let newPasswordValue = document.querySelector('#new-password').value;
        let confirmationValue = document.querySelector('#confirm-new-password').value;
        
        let isValid = false;
        if (newPasswordValue.length < 1) {
            isValid = false;
            document.querySelector('#reset-password p.error-new-password').innerHTML = 'This field is required';
            document.querySelector('#reset-password .password-info').style.cssText = "color : #cd0000 !important;"
            document.querySelector('#reset-password .password-info span').style.cssText = "color : #cd0000 !important;"
        } else {
            if(confirmationValue != newPasswordValue){
                document.querySelector('#reset-password p.error-confirm-new-password').innerHTML = 'New password inputs must be similar';            
            } else {
                document.querySelector('#reset-password p.error-confirm-new-password').innerHTML = '';            
            }
            if (!passwordRegexp.test(newPasswordValue)) {
                isValid = false;
                document.querySelector('#reset-password p.error-new-password').innerHTML = 'The password is invalid';
                document.querySelector('#reset-password .password-info').style.cssText = "color : #cd0000 !important;"
                document.querySelector('#reset-password .password-info span').style.cssText = "color : #cd0000 !important;"
            } else {
                isValid = true;
                document.querySelector('#reset-password p.error-new-password').innerHTML = '';
                document.querySelector('#reset-password .password-info').style.cssText = "color : var(--grey) !important !important;"
                document.querySelector('#reset-password .password-info span').style.cssText = "color : var(--grey) !important !important;"
            }
        }

        return isValid;
    };

    function handleConfirmationChange(){
        let confirmationValue = document.querySelector('#confirm-new-password').value;
        let newPasswordValue = document.querySelector('#new-password').value;
        let isValid = false;

        if (confirmationValue.length < 1) {
            isValid = false;
            document.querySelector('#reset-password p.error-confirm-new-password').innerHTML = 'This field is required';
        } else{
            if(confirmationValue != newPasswordValue){
                isValid = false;
                document.querySelector('#reset-password p.error-confirm-new-password').innerHTML = 'New passwords must be similar';
            }
            else {
                isValid = true;
                document.querySelector('#reset-password p.error-confirm-new-password').innerHTML = '';
            }
        }
        
        return isValid;
    };

    async function submitResetPassword(e) {
        e.preventDefault();
        handleConfirmationChange();
        handlePasswordChange();

        if(handleConfirmationChange() && handlePasswordChange()){
            const newPassword = document.querySelector('#new-password').value;
            const confirmNewPassword = document.querySelector('#confirm-new-password').value;

            const dataObj = {
                newPassword : newPassword,
                confirmNewPassword : confirmNewPassword
            };

            const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/reset-password/${email}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataObj)
            });

            //Password@10
            //Password@105 -
            const contentResponse = await response.json();
            console.log(contentResponse);
            if(response.ok){
                document.querySelector('.reset-pwd-success').style.display = "block";
            } else if (contentResponse["message"] == "The token is expired!") {
                window.location.reload(false);
            } else{
                document.querySelector('.reset-pwd-error').style.display = "block";
            }
            
      
        } else{
            console.log('false');
        }
    }
        
    return (
        
        <React.Fragment>
            <Header/>
            <main className="user-bg error" id="edit">
                <div className="main-content">
                {isTokenValid ? <Title value="Reset password"/> : ""}

                    <section className="edit-form-container margin-auto">
                        {{
                        true: 
                            <form id="reset-password" onSubmit={submitResetPassword}>
                                <h3>{email != null ? email : ""}</h3>
                                <p className="indication">Please provide a new password</p>
                                <div className="form-control">
                                    <FormField fieldTagName="input" type="password" placeholder="New password" id="new-password" onChange={handlePasswordChange}/>
                                    <p className='error error-new-password'></p>
                                    <p className="password-info">&#128712;<span>At least :<br/>- 8 characters <br/>- 1 lowercase letter<br/>- 1 uppercase letter,<br/>- 1 special character (@$!%*?&)</span></p>
                                </div>
                                <div className="form-control">
                                    <FormField fieldTagName="input" type="password" placeholder="Confirm new password" id="confirm-new-password" onChange={handleConfirmationChange}/>
                                    <p className='error error-confirm-new-password'></p>
                                </div>
                                <div className="form-control">
                                    <Button tagName="input" type="submit" btnValue="New password"/>       
                                </div>
                                <Modal className="error-modal reset-pwd-error" content={
                                    <div className="flex-center-column">
                                        <Title value='Error'/>    
                                        <p className="error-msg">The provided password is not valid or similar to the old password</p>
                                        <Button tagName="button" btnValue="Close" onClick={(e) => {e.preventDefault(); e.target.parentNode.parentNode.parentNode.style.display = "none";}}/>       
                                    </div>
                                }/>
                                <Modal className="success-modal reset-pwd-success" content={
                                    <div className="flex-center-column">
                                        <Title value='Success'/>    
                                        <p className="success-msg">The password has been reset successfully</p>
                                        <Button tagName="button" btnValue="Close" onClick={(e) => {e.target.parentNode.parentNode.parentNode.style.display = "none";}}/>       
                                    </div>
                                }/>
                            </form>,
                        false:                             
                        <div id="reset-password">
                            <p className="indication">The token is no longer valid ! </p>
                            <p className="indication">You have to demand another reset password link.</p>
                        </div>,
                        null : ""

                        }[isTokenValid]}
                    
                    </section>
                </div>
            </main>
            <Footer/>
        </React.Fragment>
        

    );
  }
  export default ResetPassword;