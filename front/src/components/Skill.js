import React, { } from 'react';
import '../styles/components/Skill.css'
import { FaInfoCircle, FaStar } from 'react-icons/fa';
import Rating from './ShowRate';


function Skill(props) {
    // logique permettant qu'en fonction du props.rate, on affiche le nombre d'étoiles correspondants

  return (
    <div className="skill">
        <div className="skill-name">{props.name}</div>                            
        <Rating value={props.rate}/>
    </div>
  );
}

export default Skill;