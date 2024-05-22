import React,{  } from "react";
import Modal from "./Modal";
import Title from "./Title";
import Button from "./Button";
import FormField from "./FormField";

function Share(props) {
    function closeModal(event){
        event.target.parentNode.parentNode.parentNode.style.display = "none";
    }

    function copyToClipBoard(event) {
        
        console.log(event.target.textContent);
          // Get the text field
         var copyText = event.target.parentNode.parentNode.querySelector("input#copylink");

        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);

        // Alert the copied text
        // alert("Copied the text: " + copyText.value);
        event.target.innerHTML = " <span style='color:lightgreen; transform: scale(3)'>✓</span>&nbsp;&nbsp;Text copied to clipbard"

        setTimeout(() => {
            event.target.textContent = "Copy link"
        }, 3000);
    }

    return(
         <React.Fragment>

        <Modal className="share-modal" content={
            <React.Fragment>
                <div className="flex-center-column">
                    <Title value='Share your portfolio'/>
                    <p className="indication">Copy your link portfolio to the clipboard and share it to recruiter or customers</p>
                        <div className="form-control">
                            <FormField fieldTagName="input" type="text" placeholder="copylink" id="copylink" readOnly={true} defaultValue={process.env.REACT_APP_DOMAIN_CLIENT + "/portfolio/" + props.userId}/>
                            <p className='error error-password'></p>
                        </div>
                        <div className="form-control">
                            <Button tagName="button" btnValue="Copy link" onClick={copyToClipBoard}/>       
                        </div>
                </div>
            </React.Fragment>
        }/>

            {/* <Modal className="error-modal login-error" content={
                <React.Fragment>
                    <div className="flex-center-column">
                        <Title value='Error'/>    
                        <p className="error-msg">error</p>
                        <Button tagName="button" btnValue="Close" onClick={closeModal}/>       
                    </div>
                </React.Fragment>
            }/> */}

            </React.Fragment>
    )
}

export default Share;