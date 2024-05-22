import React, {useEffect, useState} from "react";
import '../styles/components/Modal.css'
import FormField from "./FormField";
import { FaCamera, FaPen, FaTrash } from "react-icons/fa";
import Button from "./Button";
import Title from "./Title";
import Modal from "./Modal";

function ProjectsEdit (props) {
    const [projectData, setProjectData ] = useState(props.data);

    const [projectEditionType, setProjectEditionType] = useState(null);
    const [attEditionType, setAttEditionType] = useState(null);
    const [projectElementIndex, setProjectElementIndex] = useState(null);
    const [attElementIndex, setAttElementIndex] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    let editModal;
    let attachmentModal;
    // console.log(projectData);

    useEffect(() =>{
        setProjectEditionType(null)
        setAttEditionType(null)
        setAttElementIndex(null)
        setProjectData(props.data)
    }, [])


    useEffect(() =>{
        setSelectedImage(null)
    }, [projectElementIndex])
    

    useEffect(() =>{
        editModal = document.querySelector('.backdrop.edit-modal');
        attachmentModal = document.querySelector('.backdrop.attachment-modal');

    })

    function openModal(event){
        event.preventDefault();
        let type;
        let attachmentOrNot;
        let projectIndex;
        if (event.target.tagName == "path") {
            type = event.target.parentNode.parentNode.id.split('-')[0];
            attachmentOrNot = event.target.parentNode.parentNode.id.split('-')[1];
            projectIndex = event.target.parentNode.parentNode.id.split('-')[2];
        } else if (event.target.tagName == "svg") {
            type = event.target.parentNode.id.split('-')[0];
            attachmentOrNot = event.target.parentNode.id.split('-')[1];
            projectIndex = event.target.parentNode.id.split('-')[2];
        } else {
            type = event.target.id.split('-')[0];
            attachmentOrNot = event.target.id.split('-')[1];            
            projectIndex = event.target.id.split('-')[2];
        }


        if (attachmentOrNot != "att") {
            editModal.style.display = "block";
            setProjectEditionType(type);
            const index = Number(projectIndex)
            setProjectElementIndex(index);
            setAttElementIndex(null);
        } else{
            attachmentModal.style.display = "block";
            setAttEditionType(type);            
            setAttElementIndex(parseInt(projectIndex));
        }

        console.log(Number.isInteger(projectElementIndex));
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
// update & create project
    async function submitProject(e){
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const title = form[1].value;
        const description = form[2].value;

        if (title.length < 1 && description.length < 1 ){
            document.querySelector(`#${form.id} .error-project-title`).innerText = "This field is required"
            document.querySelector(`#${form.id} .error-project-description`).innerText = "This field is required"
        } else if (description.length < 1){
            document.querySelector(`#${form.id} .error-project-description`).innerText = "This field is required"
        } else if (title.length < 1) {
            document.querySelector(`#${form.id} .error-project-title`).innerText = "This field is required"
        } else{
            const dataObj = {
                title : title,
                description : description
            }
        
            formData.append('data', JSON.stringify(dataObj));
            const projectId = form.className;
            const response = await fetch(form.id == "create" ?`${process.env.REACT_APP_DOMAIN_API}/api/set-project` :`${process.env.REACT_APP_DOMAIN_API}/api/update-project/${projectId}` , {
                method : 'POST',
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
                },
                body : formData
            });
            const contentResponse = await response.json();
            
            console.log(contentResponse);
            setProjectData(contentResponse);
            // setProjectElementIndex(null);
            editModal.style.display = "none";
            form.reset();
        }
    }
    // delete project
    async function deleteProject(e){
        e.preventDefault();
        
        const projectId = e.target.id;
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/delete-project/${projectId}` , {
            method : 'POST',
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
            },
        });
        const contentResponse = await response.json();
        setProjectData(contentResponse);
        console.log(contentResponse);
        setProjectElementIndex(null);
        editModal.style.display = "none";
    }

     
    
    // create & update attachment

    async function submitAttachment(e) {
        e.preventDefault();
        const form = e.target;
        const title = form[0].value;
        const url = form[1].value;
        console.log(form);
        console.log(title);
        console.log(url);
        const urlRegexp = new RegExp("/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/");

        if (title.length < 1){
            document.querySelector(`#${form.id} .error-attachment-title`).innerText = "This field is required"
            if (url.length < 1){
            document.querySelector(`#${form.id} .error-attachment-link`).innerText = "This field is required"
            } else if (!urlRegexp.test(url)){
                document.querySelector(`#${form.id} .error-attachment-link`).innerText = "The URL is not valid (https://www.example.com)"
            }
        } else if (url.length < 1){
            document.querySelector(`#${form.id} .error-attachment-link`).innerText = "This field is required"
        } else{

            const projectOrAttId = form.className;

            const dataObj = {
                projectId : projectOrAttId,
                title : title,
                url : url
            }
        

            const response = await fetch(form.id == "create" ?`${process.env.REACT_APP_DOMAIN_API}/api/set-project-attachment` :`${process.env.REACT_APP_DOMAIN_API}/api/update-project-attachment/${projectOrAttId}` , {
                method : 'POST',
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
                },
                body : JSON.stringify(dataObj)
            });
            const contentResponse = await response.json();
            
            console.log(contentResponse);
            setProjectData(contentResponse);
            setAttElementIndex(null);
            attachmentModal.style.display = "none";
            form.reset();
        }
            
    }

    // delete attachment
    async function deleteAttachment(e){
        e.preventDefault();
        
        const attachmentId = e.target.id.split('-')[0];
        const projectId = e.target.id.split('-')[1]
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/delete-project-attachment/${attachmentId}` , {
            method : 'POST',
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
            },
        });
        const contentResponse = await response.json();
        console.log(contentResponse);
        setProjectData(contentResponse);
        setAttElementIndex(null);
        attachmentModal.style.display = "none";
        

    }

    function selectProfilePic(e) {
        console.log(e.target.files[0]);
        console.log(e.target.files);
        document.querySelector('.select-picture img').src = e.target.value;
        
        setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }

    return(
        <React.Fragment>
            <h3>Projects</h3>
            <div className="edit-list">
            {projectData.map((project, index) => (
                <div className="edit-element-container" key={project["id"]}>
                    <span>{project["title"]}</span>
                    <div className="edit-button">
                        <Button tagName="button" id={"update-project-" + index } btnValue={<FaPen/>} onClick={openModal}/>
                        <Button tagName="button" id={"delete-project-" + index }  btnValue={<FaTrash/>} onClick={openModal}/>
                    </div>
                </div>
            ))}
            </div>
            <Button tagName="button" id="create-project" btnValue="+ New project" onClick={openModal}/>       
                
            <Modal className="edit-modal" resetable={true} content={
            <React.Fragment>
                {
                    {
                        'delete': 
                        <React.Fragment>

                        {Number.isInteger(projectElementIndex) ?
                            <React.Fragment>
                                <Title value="Confirmation"/>
                                <p>Are you sure to delete your project <em><b>"{projectData[projectElementIndex]["title"]}"</b></em> ?</p>
                                <div className="modal-button">
                                    <Button tagName="button" btnValue="Cancel" onClick={(e) => e.target.parentNode.parentNode.parentNode.style.display = "none"} />
                                    <Button tagName="button" onClick={deleteProject} id={projectData[Number.isInteger(projectElementIndex) ? projectElementIndex : 0]["id"]} btnValue="Confirm"/>
                                </div>
                                

                            </React.Fragment>
                            : 
                            "" 
                             }
                        </React.Fragment>,
                        'create': 
                        <React.Fragment>
                            <form id="create" onSubmit={submitProject}>
                                <Title value="New project"/>
                                <div className="form-control">
                                    <div className="select-picture">
                                        <FormField fieldTagName="input" type="file" placeholder="picture" id="picture" name="fileInput" onChange={selectProfilePic}/>
                                        <p className='error error-picture'></p>
                                        <img src={ selectedImage != null ? selectedImage : process.env.REACT_APP_DOMAIN_API + "/uploads/" + 'no-project-pic.jpg'}/>
                                        <FaCamera/>
                                    </div>
                                </div>
                                <div className="form-control">
                                    <FormField fieldTagName="input" type="text" placeholder="Project title" id="project-title" defaultValue="" onChange={emptyValidation}/>
                                    <p className='error error-project-title'></p>
                                </div>
                                <div className="form-control">
                                    <FormField fieldTagName="textarea" placeholder="Project description" id="project-description" defaultValue="" onChange={emptyValidation}/>
                                    <p className='error error-project-description'></p>
                                </div>
                                <div className="form-control">
                                    <Button tagName="input" type="submit" btnValue="Save" />       
                                </div>
                            </form>
                         </React.Fragment>,
                        'update':  
                            Number.isInteger(projectElementIndex) ? 
                            <form id="update" onSubmit={submitProject} className={projectData[projectElementIndex]["id"]}>
                                <Title value={"Update project" + projectElementIndex}/>
                                <div className="form-control">
                                    <div className="select-picture">
                                        <FormField fieldTagName="input" type="file" placeholder="picture" id="picture"  name="fileInput" onChange={selectProfilePic}/>
                                        <p className='error error-picture'></p>
                                        <img src={selectedImage != null ? selectedImage : process.env.REACT_APP_DOMAIN_API + "/uploads/" + projectData[Number.isInteger(projectElementIndex)  ? projectElementIndex : 0]["img"]}/>
                                        <FaCamera/>
                                    </div>
                                </div>
                                <div className="form-control">
                                    <FormField fieldTagName="input" type="text" placeholder="Project title" id="project-title" name="project-title"  onChange={emptyValidation} defaultValue={Number.isInteger(projectElementIndex) ? projectData[projectElementIndex]['title'] : ""}/>
                                    <p className='error error-project-title'></p>
                                </div>
                                <div className="form-control">
                                    <FormField fieldTagName="textarea" placeholder="Project description" id="project-description" name="project-description" onChange={emptyValidation} defaultValue={Number.isInteger(projectElementIndex) ? projectData[projectElementIndex]['description'] : ""}/>
                                    <p className='error error-project-description'></p>
                                </div>
                                <div className="attachments">
                                    <Button tagName="button" btnValue="+ Add an attachment" id="create-att" onClick={openModal}/>       
                                    <div className="edit-list">
                                        {Number.isInteger(projectElementIndex)  ? 
                                        projectData[projectElementIndex]["attachments"].map((attachment, index) => (
                                            <div className="edit-element-container" key={attachment["id"]}>
                                                <span>{attachment["title"]}</span>
                                                {/* <span>{projectElementIndex}</span> */}
                                                <div className="edit-button">
                                                    <Button tagName="button" id={"update-att-" + index} btnValue={<FaPen/>} onClick={openModal}/>
                                                    <Button tagName="button" id={"delete-att-" + index} btnValue={<FaTrash/>} onClick={openModal}/>
                                                </div>
                                            </div>
                                        ))
                                        : 
                                        ""
                                        } 
                                    </div>
                                </div>
                                <div className="form-control">
                                    <Button tagName="input" type="submit" btnValue="Save"/>       
                                </div>
                            </form>              
                        :
                        ""
                    }[projectEditionType] 
                }                
            </React.Fragment>
            }/>


            <Modal className="attachment-modal" resetable={true} content={
                    <React.Fragment>
                    {
                        {  
                        'delete': 
                            Number.isInteger(attElementIndex) && Number.isInteger(projectElementIndex) ? 
                            <React.Fragment>
                                <Title value="Confirmation"/>
                                <p>Are you sure to delete the attachment <em><b>"{projectData[projectElementIndex]["attachments"][attElementIndex]["title"]}"?</b></em></p>
                                <div className="modal-button">
                                    <Button tagName="button" btnValue="Cancel" onClick={(e) => e.target.parentNode.parentNode.parentNode.style.display = "none"}/>
                                    <Button tagName="button" btnValue="Confirm" onClick={deleteAttachment} id={projectData[projectElementIndex]["attachments"][attElementIndex]["id"] + "-" + projectElementIndex}/>
                                </div>
                            </React.Fragment>
                                : 
                                "",
                        'create':                         
                            <form id="create" className={Number.isInteger(projectElementIndex) ? projectData[projectElementIndex]["id"]:""} onSubmit={submitAttachment}>
                                <Title value="New project attachment"/>
                                <div className="form-control">
                                    <FormField fieldTagName="input" type="text" placeholder="Title" id="attachment-title" defaultValue="" onChange={emptyValidation}/>
                                    <p className='error error-attachment-title'></p>
                                </div>
                                <div className="form-control">
                                    <FormField fieldTagName="input" placeholder="Link" id="attachment-link" defaultValue="" onChange={urlValidation}/>
                                    <p className='error error-attachment-link'></p>
                                </div>
                                <div className="form-control">
                                    <Button tagName="input" type="submit" btnValue="Save"/>       
                                </div>
                            </form>,
                        'update': 
                        <React.Fragment>
                            {Number.isInteger(attElementIndex) && Number.isInteger(projectElementIndex)  ? 
                                <form id="update" onSubmit={submitAttachment} className={projectData[projectElementIndex]["attachments"][attElementIndex]["id"]}>

                                    <Title value="Update project attachment"/>
                                    <div className="form-control">
                                        <FormField fieldTagName="input" type="text" placeholder="Title" id="attachment-title" defaultValue={projectData[projectElementIndex]["attachments"][attElementIndex]["title"]} onChange={emptyValidation}/>
                                        <p className='error error-attachment-title'></p>
                                    </div>
                                    <div className="form-control">
                                        <FormField fieldTagName="input" placeholder="Link" id="attachment-link" defaultValue={projectData[projectElementIndex]["attachments"][attElementIndex]["url"]} onChange={urlValidation}/>
                                        <p className='error error-attachment-link'></p>
                                    </div>
                                    <div className="form-control">
                                        <Button tagName="input" type="submit" btnValue="Save"/>       
                                    </div>  
                                </form>

                            : 
                            ""
                            }
                        </React.Fragment>

                        }[attEditionType]
                    }
                </React.Fragment> 
                }/>
        </React.Fragment>
    );
}

export default ProjectsEdit;