import React, {useEffect, useState} from "react";
import '../styles/components/Modal.css'
import FormField from "./FormField";
import { FaCamera, FaPen, FaStar, FaTrash } from "react-icons/fa";
import Button from "./Button";
import Title from "./Title";
import Modal from "./Modal";
import Rating from "./Rating";
import ShowRate from "./ShowRate";

function SkillsEdit (props) {
    const [skillsData, setSkillsData ] = useState(props.data);
    const [skillRate, setSkillRate] = useState(null);

    const [editionType, setEditionType] = useState(null);
    const [elementIndex, setElementIndex] = useState(null);

    let editModal;
    console.log(skillsData);

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

    function emptyValidation(e){
        const inputValue = e.target.value
        const errorContainer = e.target.parentNode.querySelector('p.error')
        if (inputValue.length < 1) {
            errorContainer.innerText = "This field is required"
        } else{
            errorContainer.innerText = ""
        }
    }

    async function submitSkill(e){
        e.preventDefault();
        const form = e.target;
        
        const title = form[0].value;
        const rate = Number(form.querySelector("input[type='radio']:checked").value);
        
        console.log(form);
        console.log(title);
        console.log(rate);

        if (title.length < 1){
            document.querySelector(`#${form.id} .error-skill-title`).innerText = "This field is required"
        } else{
            const dataObj = {
                title : title,
                rate : rate
            }
        
            const skillId = form.className;
            const response = await fetch(form.id == "create" ?`${process.env.REACT_APP_DOMAIN_API}/api/set-skill` :`${process.env.REACT_APP_DOMAIN_API}/api/update-skill/${skillId}` , {
                method : 'POST',
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
                },
                body : JSON.stringify(dataObj)
            });
            const contentResponse = await response.json();
            
            console.log(contentResponse);
            setSkillsData(contentResponse);
            editModal.style.display = "none";
            form.reset();
        }
    }
    // delete project
    async function deleteSkill(e){
        e.preventDefault();
        
        const skillId = e.target.id;
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/delete-skill/${skillId}` , {
            method : 'POST',
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
            },
        });
        const contentResponse = await response.json();
        setSkillsData(contentResponse);
        setElementIndex(null);
        console.log(contentResponse);
        editModal.style.display = "none";
    }

 
     
    return(
        <React.Fragment>
            <h3>Skills</h3>
            <div className="edit-list">
                {skillsData.map((skill, index) => (
                <div className="edit-element-container skill" key={skill["id"]}>
                    <div className="top">
                        <span>{skill['title']}</span>
                        <div className="edit-button">
                            <Button tagName="button" id={"update-skill-" + index} btnValue={<FaPen/>} onClick={openModal}/>
                            <Button tagName="button" id={"delete-skill-"+ index} btnValue={<FaTrash/>} onClick={openModal}/>
                        </div>     
                    </div>
                    <div className="bottom">
                        <div className="skill-rate">
                            <ShowRate value={skill['rate']}/>
                        </div>
                    </div>                       
                </div>
                ))}
            </div> 
            <Button tagName="button" id="create-skill" btnValue="+ New skill" onClick={openModal}/>       
        
            <Modal className="edit-modal" resetable={true} content={
            <React.Fragment>
                {
                    {
                        'delete': 
                            Number.isInteger(elementIndex) ?
                                <React.Fragment>
                                    <Title value="Confirmation"/>
                                    <p>Are you sure to delete the skill <em><b>"{skillsData[elementIndex]["title"]}"</b></em>?</p>
                                    <div className="modal-button">
                                        <Button tagName="button" btnValue="Cancel" onClick={(e) => e.target.parentNode.parentNode.parentNode.style.display = "none"}/>
                                        <Button tagName="button" btnValue="Confirm" id={skillsData[elementIndex]["id"]} onClick={deleteSkill}/>
                                    </div>
                                </React.Fragment>
                            :
                            "",
                        'create': 
                            <form id="create" onSubmit={submitSkill}>
                                <Title value="New skill"/>
                                <div className="wrap">
                                    <div className="form-control">
                                        <FormField fieldTagName="input" placeholder="Skill name" id="skill-name" defaultValue="" onChange={emptyValidation}/>
                                        <p className='error error-skill-title'></p>
                                    </div>
                                    <Rating value={1}/>
                                </div>
                                <div className="form-control">
                                    <Button tagName="input" type="submit" btnValue="Save"/>       
                                </div>
                            </form>,
                        'update':  
                            Number.isInteger(elementIndex) ? 
                                <form id="update" className={skillsData[elementIndex]["id"]} onSubmit={submitSkill}>
                                    <Title value="Update skill"/>
                                    <div className="wrap">
                                        <div className="form-control">
                                            <FormField fieldTagName="input" placeholder="Skill name" id="skill-name" defaultValue={skillsData[elementIndex]["title"]} onChange={emptyValidation}/>
                                            <p className='error error-skill-title'></p>
                                        </div>
                                        <Rating value={skillsData[elementIndex]["rate"]} />
                                    </div>
                                    <div className="form-control">
                                        <Button tagName="input" type="submit" btnValue="Save"/>       
                                    </div>
                                </form>
                            : 
                            ""
                    }[editionType]
                }
            </React.Fragment>
            }/>

        </React.Fragment>
    );
}

export default SkillsEdit;