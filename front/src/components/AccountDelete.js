import React, { useEffect } from "react";
import Modal from "./Modal";
import FormField from "./FormField";
import Button from "./Button";
import Title from "./Title";
import { useNavigate } from "react-router-dom";

function AccountDelete(props) {


    const navigate = useNavigate();

    const handleCurrentPassword = () => {
        let confirmationValue = document.querySelector('#deleteacc-password').value;
        let isValid = false;
        if (confirmationValue.length < 1) {
            document.querySelector('.account-delete-modal p.error-password').innerHTML = 'This field is required';
            isValid = false
        } else{
            isValid = true
            document.querySelector('.account-delete-modal p.error-password').innerHTML = '';
        }

        return isValid;
    }
    
    
    
    async function formSubmit(e){
        e.preventDefault();
        handleCurrentPassword();

        if(handleCurrentPassword()){
            console.log('true');

            const currentPassword = document.querySelector('#deleteacc-password').value;
          
            const dataObj = {
                currentPassword : currentPassword,
            };

            const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/delete-account`, {
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
                let successModal = document.querySelector('.backdrop.success-modal.accdelete-success');
                // successModal.querySelector('.backdrop.success-modal.signup-success .success-msg').innerHTML = contentResponse.message
                successModal.style.display = "block"
            } else{
                let errorModal = document.querySelector('.backdrop.error-modal.accdelete-error');
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
     
    function RedirectToHomePage(e) {
        navigate('/');
        localStorage.clear();
    }

    return(
    <React.Fragment>
        <Modal className="account-delete-modal" content={
            <React.Fragment>
                <div className="flex-center-column">
                    <Title value='Delete your account'/>
                    <p className="indication">Enter your password to confirm your account deletion</p>
                    <p className="indication">WARNING : Your account will be permanently deleted !</p>
                    <form id="change-password" className="flex-center-column" onSubmit={formSubmit}> 
                        <div className="form-control">
                            <FormField fieldTagName="input" type="password" placeholder="Current password" id="deleteacc-password" onChange={handleCurrentPassword}/>
                            <p className='error error-password'></p>
                        </div>
                        <div className="form-control">
                            <Button tagName="input" type="submit" btnValue="Delete my account"/>       
                        </div>
                    </form>
                </div>

               
            </React.Fragment>
        }/>

        <Modal className="error-modal accdelete-error" content={
            <React.Fragment>
                <div className="flex-center-column">
                    <Title value='Error'/>    
                    <p className="error-msg">The provided password is not correct !</p>
                    <Button tagName="button" btnValue="Close" onClick={closeModal}/>       
                </div>
            </React.Fragment>
        }/>
        
          <Modal className="success-modal accdelete-success" closable="no" content={
            <React.Fragment>
                <div className="flex-center-column">
                    <Title value='Success'/>    
                    <p className="success-msg">Successful account deletion !</p>
                    <Button tagName="button" btnValue="Go To HomePage" onClick={RedirectToHomePage}/>       
                </div>
            </React.Fragment>
        }/>

        </React.Fragment>
        
    )
}

export default AccountDelete;
