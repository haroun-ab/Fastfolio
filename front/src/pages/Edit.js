import React, {useEffect, useState} from "react";
import Title from "../components/Title";
import '../styles/pages/edit.css'
import Header from "../components/Header";
import ProfileEdit from "../components/ProfileEdit";
import ProjectsEdit from "../components/ProjectsEdit";
import SkillsEdit from "../components/SkillsEdit";
import SMEdit from "../components/SMEdit";
import {setTheme, getBackground} from "../common";

function Edit () {
    const [formSelected, setFormSelected] = useState("PROFILE");
    const [profileData, setProfileData] = useState(null);
    const [skillsData, setSkillsData] = useState(null);
    const [socialMediaData, setSocialMediaData] = useState(null);
    const [projectsData, setProjectsData] = useState(null);

    
   
 
     // Récupérer les données du portfolio en étant connecté
     async function getPortfolio (){
        const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/get-portfolio`, {
         method : 'GET',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${localStorage.getItem('jwt')}`
        },
        })
        const contentResponse = await response.json();
        console.log(contentResponse);

        setSkillsData(contentResponse['skills']);
        setSocialMediaData(contentResponse['socialMedia']);
        setProfileData(contentResponse['profile']);
        setProjectsData(contentResponse['projects']);

        console.log(profileData);
    }

    useEffect(() =>{
        getBackground();
        setTheme();
        document.querySelector('.edit-navbar-form.profile').onclick = () => {
            setFormSelected("PROFILE");
        };
        document.querySelector('.edit-navbar-form.projects').onclick = () => {
            setFormSelected("PROJECTS");
        }; 
        document.querySelector('.edit-navbar-form.skills').onclick = () => {
            setFormSelected("SKILLS");
        }; 
        document.querySelector('.edit-navbar-form.sm').onclick = () => {
            setFormSelected("SM");
        };
        getPortfolio();
    }, [formSelected])

    return(
       
        <React.Fragment>
            <Header/>
             <main className="user-bg">
                <div id="edit" className="main-content"> 
                    <Title value="Edit my portfolio"/>
                   <div className="edit-container">
                        <div className="edit-navbar-list">
                            <div className={formSelected == 'PROFILE' ? "edit-navbar-form profile selected" : "edit-navbar-form profile" }>
                                Profile
                            </div>
                            <div className={formSelected == 'PROJECTS' ? "edit-navbar-form projects selected" : "edit-navbar-form projects" }>
                                Projects
                            </div>
                            <div className={formSelected == 'SKILLS' ? "edit-navbar-form skills selected" : "edit-navbar-form skills" }>
                                Skills
                            </div>
                            <div className={formSelected == 'SM' ? "edit-navbar-form sm selected" : "edit-navbar-form sm" }>
                                Social media
                            </div>
                        </div>
                        <section className="edit-form-container">
                            {formSelected == 'PROFILE' ? 
                            <ProfileEdit data={profileData != null ? profileData : ""}/>
                            : 
                            formSelected == 'PROJECTS' ? 
                            <ProjectsEdit data={projectsData != null ? projectsData : ""}/>
                            :
                            formSelected == 'SKILLS' ? 
                            <SkillsEdit data={skillsData != null ? skillsData : ""}/> 
                            : 
                            <SMEdit data={socialMediaData != null ? socialMediaData : ""}/> 
                            }
                        </section>
                   </div>
                </div>    
            </main>
            
        </React.Fragment>
    )
}
export default Edit;


