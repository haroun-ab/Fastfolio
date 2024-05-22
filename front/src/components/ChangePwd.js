import React, { useEffect } from "react";
import Modal from "./Modal";
import FormField from "./FormField";
import Button from "./Button";
import Title from "./Title";

function ChangePwd(props) {
    const passwordRegexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")

    const handlePasswordChange = () => {
        let newPasswordValue = document.querySelector('#new-password').value;
        let confirmationValue = document.querySelector('#confirm-new-password').value;
        
        let isValid = false;
        if (newPasswordValue.length < 1) {
            isValid = false;
            document.querySelector('#change-password p.error-new-password').innerHTML = 'This field is required';
            document.querySelector('#change-password .password-info').style.cssText = "color : #cd0000 !important;"
            document.querySelector('#change-password .password-info span').style.cssText = "color : #cd0000 !important;"
        } else {
            if(confirmationValue != newPasswordValue){
                document.querySelector('#change-password p.error-confirm-new-password').innerHTML = 'New password inputs must be similar';            
            } else {
                document.querySelector('#change-password p.error-confirm-new-password').innerHTML = '';            
            }
            if (!passwordRegexp.test(newPasswordValue)) {
                isValid = false;
                document.querySelector('#change-password p.error-new-password').innerHTML = 'The password is invalid';
                document.querySelector('#change-password .password-info').style.cssText = "color : #cd0000 !important;"
                document.querySelector('#change-password .password-info span').style.cssText = "color : #cd0000 !important;"
            } else {
                isValid = true;
                document.querySelector('#change-password p.error-new-password').innerHTML = '';
                document.querySelector('#change-password .password-info').style.cssText = "color : var(--grey) !important !important;"
                document.querySelector('#change-password .password-info span').style.cssText = "color : var(--grey) !important !important;"
            }
        }

        return isValid;
    };

    const handleConfirmationChange = () => {
        let confirmationValue = document.querySelector('#confirm-new-password').value;
        let newPasswordValue = document.querySelector('#new-password').value;
        let isValid = false;

        if (confirmationValue.length < 1) {
            isValid = false;
            document.querySelector('.change-pwd-modal p.error-confirm-new-password').innerHTML = 'This field is required';
        } else{
            if(confirmationValue != newPasswordValue){
                isValid = false;
                document.querySelector('.change-pwd-modal p.error-confirm-new-password').innerHTML = 'New passwords must be similar';
            }
            else {
                isValid = true;
                document.querySelector('.change-pwd-modal p.error-confirm-new-password').innerHTML = '';
            }
        }
        
        return isValid;
    };

    const handleCurrentPassword = () => {
        let confirmationValue = document.querySelector('#current-password').value;
        let isValid = false;
        if (confirmationValue.length < 1) {
            document.querySelector('.change-pwd-modal p.error-current-password').innerHTML = 'This field is required';
            isValid = false
        } else{
            isValid = true
            document.querySelector('.change-pwd-modal p.error-current-password').innerHTML = '';
        }

        return isValid;
    }
    
    
    
    async function formSubmit(e){
        e.preventDefault();
        handleCurrentPassword();
        handleConfirmationChange();
        handlePasswordChange();

        if(handleCurrentPassword() && handleConfirmationChange() && handlePasswordChange()){
            console.log('true');

            const currentPassword = document.querySelector('#current-password').value;
            const newPassword = document.querySelector('#new-password').value;
            const confirmNewPassword = document.querySelector('#confirm-new-password').value;

            const dataObj = {
                currentPassword : currentPassword,
                newPassword : newPassword,
                confirmNewPassword : confirmNewPassword
            };

            const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/change-password`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(dataObj)
            });
            //Password@10
            //Password@105 -
            const contentResponse = await response.json();
            
            if (response.status == "200") {
                let successModal = document.querySelector('.backdrop.success-modal.change-pwd-success');
                // successModal.querySelector('.backdrop.success-modal.signup-success .success-msg').innerHTML = contentResponse.message
                successModal.style.display = "block"
            } else{
                let errorModal = document.querySelector('.backdrop.error-modal.change-pwd-error');
                // errorModal.querySelector('.backdrop.success-modal.signup-success .success-msg').innerHTML = contentResponse.message
                errorModal.style.display = "block"
            }
        } else{
            console.log('false');
        }
    }

    function closeModal(event){
        event.target.parentNode.parentNode.parentNode.style.display = "none";
    }
     
    function closeSuccessPwdModal(e) {
        const successModal = document.querySelector('.backdrop.success-modal.change-pwd-success');
        const changePwdModal = document.querySelector('.backdrop.change-pwd-modal');
        const changePwdForm = document.querySelector('form#change-password');
        successModal.style.display = "none";
        changePwdForm.reset();
        changePwdModal.style.display = "none";
    }

    return(
    <React.Fragment>
        <Modal className="change-pwd-modal" content={
            <React.Fragment>
                <div className="flex-center-column">
                    <Title value='New password'/>
                    <p className="indication">You have to provide your old password, and the new one with confirmation.</p>
                    <form id="change-password" className="flex-center-column" onSubmit={formSubmit}> 
                        <div className="form-control">
                            <FormField fieldTagName="input" type="password" placeholder="Current password" id="current-password" onChange={handleCurrentPassword}/>
                            <p className='error error-current-password'></p>
                        </div>
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
                            <Button tagName="input" type="submit" btnValue="Change password"/>       
                        </div>
                    </form>
                </div>

               
            </React.Fragment>
        }/>

   <Modal className="error-modal change-pwd-error" content={
            <React.Fragment>
                <div className="flex-center-column">
                    <Title value='Error'/>    
                    <ul className="error-msg">
                        <li>
                            Old password is incorrect
                        </li>
                        &nbsp;<i>et/ou</i>
                        <li>
                            new password is not valid <br/>
                        </li>
                        &nbsp;<i>et/ou</i>
                        <li>
                            password confirmation is incorrect <br/>
                        </li>
                        &nbsp;<i>et/ou</i>
                        <li>
                            old and new password are similar  !
                        </li>
                    </ul>
                    <Button tagName="button" btnValue="Close" onClick={closeModal}/>       
                </div>
            </React.Fragment>
        }/>
        
          <Modal className="success-modal change-pwd-success" closable="no" content={
            <React.Fragment>
                <div className="flex-center-column">
                    <Title value='Success'/>    
                    <p className="success-msg">Mot de passe modifié avec succés !</p>
                    <Button tagName="button" btnValue="Go back" onClick={closeSuccessPwdModal}/>       
                </div>
            </React.Fragment>
        }/>

        </React.Fragment>
        
    )
}

export default ChangePwd;
