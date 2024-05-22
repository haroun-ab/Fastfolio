import React, { useEffect, useState } from 'react';
import '../styles/pages/project.css'
import { FaExternalLinkAlt, FaArrowCircleDown, FaAngleDown} from 'react-icons/fa';
import Button from '../components/Button';
import Title from '../components/Title';

function Project(props) {
//   const [isProjectOpen, SetProjectOpen] = useState(null);
//   function handleClick (event){
//     console.log(event.target.id);
//   }
const projectData = props.projectData;
console.log(projectData);
  function handleCLick(event) {
    console.log(event.target);

    if (event.target.classList.contains('project-page') || 
      event.target.classList.contains('project-page-container') || 
      event.target.classList.contains('project-page-content')) {
        const projectPage = document.querySelector(`.project-page-${projectData.id}`)
        if(window.innerWidth < 1024){
          projectPage.style.transform = "translateY(1000px)";
        } else{
          projectPage.style.opacity = 0;
        }
    
        setTimeout(() => {
          projectPage.style.display = "none";
        }, 600);
    }
   

    
  }
   
  return (
   
    
    <React.Fragment>
      <div className={'project-page visible project-page-' +projectData.id} onClick={handleCLick} >
              <div className='project-page-container'>
              <Title value={projectData.title}/>
              
              <div className='project-page-content'>

            <section className='project-img'><img src={process.env.REACT_APP_DOMAIN_API + '/uploads/' + projectData.img}/></section>
            <div className='project-details'>
              <Title value={projectData.title}/>
              <section className='project-description'>
                <Title value="Description"/>
                <p className='project-details-text'>
                    {projectData['description']}
                </p>
              </section>
              <section className='project-attachments'>
                <Title value="Attachments"/>
                <p className='project-details-text'>
                  {
                    projectData['attachments'].map((attachment) => (
                      <a className={"attachment-" + attachment.id} href={attachment.url} target='_blank'><FaExternalLinkAlt/>&nbsp;{attachment.title}</a>
                    ))
                  }
                </p>
              </section>
              </div>

              </div>
            </div>
        </div>

   
    </React.Fragment>
  );
}

export default Project;