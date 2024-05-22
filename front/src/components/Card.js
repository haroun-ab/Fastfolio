import React, { useState } from 'react';
import '../styles/components/Card.css'
import { FaInfoCircle } from 'react-icons/fa';
import Project from '../pages/Project';

function Card(props) {
  const [isProjectOpen, setProjectOpen] = useState(null);

  const [projectData, setProjectData] = useState(null);

  function handleClick (event){
    setProjectOpen(true);
    const clickedEl = event.target;
    const projectsData = props.projectData;
    console.log(props.projectData);
    console.log(props.id);
    // console.log(event.target);
    projectsData.forEach(project => {

      if (clickedEl.classList.contains(project["id"])) {
        console.log("on est là");
        console.log(clickedEl);
        setProjectData(project);
        const projectPage = document.querySelector(`.project-page-${project["id"]}`)
        if (projectPage != null) {
          projectPage.style.transform = "translateY(0)"
          projectPage.style.opacity = 1;
          projectPage.style.display = "block";
        }
      }
    });
  }

  return (
    <React.Fragment>
    <div className={props.className + " card " + props.id} onClick={handleClick}  >
        <img src={props.imgPath} className={"card-img " + props.id}/>
        <div className={"card-title-container " + props.id}>
            <span className={"card-title " + props.id}>{props.title}</span>
        </div>
    </div>      
    
    {{
      true : <Project projectData={projectData} />

    }[isProjectOpen]}
    </React.Fragment>
  );
}

export default Card;