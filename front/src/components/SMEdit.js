import React, {useEffect, useState} from "react";
import '../styles/components/Modal.css'
import FormField from "./FormField";
import { FaPen, FaTrash } from "react-icons/fa";
import Button from "./Button";
import Title from "./Title";
import Modal from "./Modal";
function SMEdit (props) {
    const [smData, setSmData] = useState(props.data);

    const [editionType, setEditionType] = useState(null);
    const [elementIndex, setElementIndex] = useState(null);

    let editModal;
 
    console.log(smData);

    useEffect(() =>{
        editModal = document.querySelector('.backdrop.edit-modal');
    })

    function openModal(event){
        event.preventDefault();
        let type;
        let elementIndex;
        if (event.target.tagName == "path") {
            type = event.target.parentNode.parentNode.id.split('-')[0];
            elementIndex = event.target.parentNode.parentNode.id.split('-')[2];
        } else if (event.target.tagName == "svg") {
            type = event.target.parentNode.id.split('-')[0];
            elementIndex = event.target.parentNode.id.split('-')[2];
        } else {
            type = event.target.id.split('-')[0];
            elementIndex = event.target.id.split('-')[2];
        }
    
        editModal.style.display = "block";
        setEditionType(type);
        setElementIndex(parseInt(elementIndex));
    }

    function urlValidation(e){
        const urlRegexp = new RegExp("^https?://(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$");        const inputValue = e.target.value;
        const errorContainer = e.target.parentNode.querySelector('p.error')
        if (inputValue.length < 1) {
            errorContainer.innerText = "This field is required"
        } else if (!urlRegexp.test(inputValue)) {
            errorContainer.innerText = "The URL is not valid (https://www.example.com)"
            console.log('pas ok');

        } else{
            errorContainer.innerText = ""
            console.log('ok');
        }
    }
    
    function emptyValidation(e){
        const inputValue = e.target.value
        const errorContainer = e.target.parentNode.querySelector('p.error')
        if (inputValue.length < 1) {
            errorContainer.innerText = "This field is required"
        } else{
            errorContainer.innerText = ""
        }
    }

    async function submitSm(e){
        e.preventDefault();
        const form = e.target;
        const title = form[0].value;
        const url = form[1].value;
        console.log(form);
        console.log(title);
        console.log(url);
        const urlRegexp = new RegExp("/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/");

        if (title.length < 1){
            document.querySelector(`#${form.id} .error-sm-title`).innerText = "This field is required"
            if (url.length < 1){
            document.querySelector(`#${form.id} .error-sm-link`).innerText = "This field is required"
            } else if (!urlRegexp.test(url)){
                document.querySelector(`#${form.id} .error-sm-link`).innerText = "The URL is not valid (https://www.example.com)"
            }
        } else if (url.length < 1){
            document.querySelector(`#${form.id} .error-sm-link`).innerText = "This field is required"
        } else{

            const smId = form.className;

            const dataObj = {
                title : title,
                url : url
            }
        
        
            const response = await fetch(form.id == "create" ?`${process.env.REACT_APP_DOMAIN_API}/api/set-socialmedia` :`${process.env.REACT_APP_DOMAIN_API}/api/update-socialmedia/${smId}` , {
                method : 'POST',
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
                },
                body : JSON.stringify(dataObj)
            });
            const contentResponse = await response.json();
                        
            console.log(contentResponse);
            setSmData(contentResponse);
            setElementIndex(null);
            editModal.style.display = "none";
            form.reset();
        }
    }
    async function deleteSm(e){
        e.preventDefault();
        
        const smId = e.target.id;
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/delete-socialmedia/${smId}` , {
            method : 'POST',
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
            },
        });
        const contentResponse = await response.json();
        setSmData(contentResponse);
        setElementIndex(null);
        console.log(contentResponse);
        editModal.style.display = "none";
    }
    return(
        <React.Fragment>
            <h3>Social media</h3>
            <div className="edit-list">   
                {smData.map((sm, index) => (
                    <div className="edit-element-container" key={sm["id"]}>
                        <span>{sm["title"]}</span>
                        <div className="edit-button">
                            <Button tagName="button" id={"update-sm-" + index} btnValue={<FaPen/>} onClick={openModal}/>
                            <Button tagName="button" id={"delete-sm-" + index} btnValue={<FaTrash/>} onClick={openModal}/>
                        </div>
                    </div>
                ))
                }
            </div>
        <Button tagName="button" id="create-sm" btnValue="+ New social media" onClick={openModal}/>       
    
        <Modal className="edit-modal" resetable={true} content={
            <React.Fragment>
                {
                    {
                    'delete': 
                        Number.isInteger(elementIndex) ?
                            <React.Fragment>
                                <Title value="Confirmation"/>
                                <p>Are you sure to delete your <em><b>"{smData[elementIndex]["title"]}"</b></em> account?</p>
                                <div className="modal-button">
                                    <Button tagName="button" btnValue="Cancel" onClick={(e) => e.target.parentNode.parentNode.parentNode.style.display = "none"}/>
                                    <Button tagName="button" btnValue="Confirm" id={smData[elementIndex]["id"]} onClick={deleteSm}/>
                                </div>
                            </React.Fragment>
                            :
                            "",
                    'create': 
                        <form id="create" onSubmit={submitSm}>
                            <Title value="New social media"/>
                                <div className="form-control">
                                    <FormField fieldTagName="input" placeholder="Social media" id="skill-sm-title" defaultValue="" onChange={emptyValidation}/>
                                    <p className='error error-sm-title'></p>
                                </div>
                                <div className="form-control">
                                    <FormField fieldTagName="input" placeholder="Link" id="skill-sm-url" defaultValue="" onChange={urlValidation}/>
                                    <p className='error error-sm-link'></p>
                                </div>
                            <div className="form-control">
                                <Button tagName="input" type="submit" btnValue="Save"/>       
                            </div>
                        </form>,
                    'update': 
                        Number.isInteger(elementIndex) ?
                            <form id="update" className={smData[elementIndex]["id"]} onSubmit={submitSm}>
                                <Title value="Update social media"/>
                                    <div className="form-control">
                                        <FormField fieldTagName="input" placeholder="Social media" id="skill-sm-title" defaultValue={smData[elementIndex]["title"]} onChange={emptyValidation}/>
                                        <p className='error error-sm-title'></p>
                                    </div>
                                    <div className="form-control">
                                        <FormField fieldTagName="input" placeholder="url" id="skill-sm-url" defaultValue={smData[elementIndex]["url"]} onChange={urlValidation}/>
                                        <p className='error error-sm-link'></p>
                                    </div>
                                <div className="form-control">
                                    <Button tagName="input" type="submit" btnValue="Save"/>       
                                </div>
                            </form> 
                        :
                        "" ,
                    }[editionType]
                }
            </React.Fragment>
        }/>
    </React.Fragment> 
    
    );
}

export default SMEdit;