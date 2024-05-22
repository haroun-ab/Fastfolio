import React, { } from 'react';
import '../styles/components/Skill.css'
import { FaInfoCircle, FaStar } from 'react-icons/fa';

function ShowRate(props) {
    // logique permettant qu'en fonction du props.rate, on affiche le nombre d'étoiles correspondants

  return (                           
        <div className="skill-rate">
            {{
              "1": <React.Fragment><FaStar/><FaStar color="var(--empty-stars)"/><FaStar color="var(--empty-stars)"/><FaStar color="var(--empty-stars)"/><FaStar color="var(--empty-stars)"/></React.Fragment>,
              "2": <React.Fragment><FaStar/><FaStar/><FaStar color="var(--empty-stars)"/><FaStar color="var(--empty-stars)"/><FaStar color="var(--empty-stars)"/></React.Fragment>,
              "3": <React.Fragment><FaStar/><FaStar/><FaStar/><FaStar color="var(--empty-stars)"/><FaStar color="var(--empty-stars)"/></React.Fragment>,
              "4": <React.Fragment><FaStar/><FaStar/><FaStar/><FaStar/><FaStar color="var(--empty-stars)"/></React.Fragment>,
              "5": <React.Fragment><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></React.Fragment>,
            }[props.value]}
        </div>
    
  );
}

export default ShowRate;