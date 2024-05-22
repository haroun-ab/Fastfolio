import React,{useEffect  }  from "react";
import Title from "./Title";
import "../styles/components/IpAuthorization.css";
import Modal from "./Modal";
import FormField from "./FormField";
import Button from "./Button";

function IpAuthorization() {

    function handleAuthorization(e){
        e.preventDefault();
        const form = e.target;
        console.log(form[0].checked);
        form.parentElement.parentElement.parentElement.style.display = "none";
        localStorage.setItem('ipAuthorization', form[0].checked)
    }

    useEffect(() => {
        localStorage.getItem('ipAuthorization') == "true" ? document.querySelector('.ipAddress').checked = true : document.querySelector('.ipAddress').checked = false
    },[])
    
    return(
        <React.Fragment>

            <Modal className="ip-modal" closable="no" content={    
                <div className="flex-center-column">
                    <Title value="Authorization"/>
                        
                            <form className="parameter" onSubmit={handleAuthorization}>
                                <div className="flex-center form-control">
                                    <label>Allow Fastfolio to get my ip address</label>
                                    <label className="switch">
                                        <input className="ipAddress" type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                
                                <p className="indication">Ip address will be used only to improve user experience</p>
                                <div className="form-control">
                                    <Button tagName="input" type="submit" btnValue="Save" />   
                                </div>    
                            </form>
                    {/* <p className="indication">If you don’t have a Fastfolio account, use your email to sign up.</p>
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
                          
                    </form> */}
                </div> 
            }/>

    </React.Fragment>

    )
}

export default IpAuthorization;