import React, { } from 'react';
import {FaThumbsUp, FaUserTie, FaEye} from "react-icons/fa"

function Stat(props) {
    // logique permettant de récupéré l'icone nécessaire pour le prop.type
  return (
    <div className='stat'>
        <div>
          {
            {
              "Views": <FaEye/>,
              "Likes": <FaThumbsUp/>,
              "Single views": <FaUserTie/>,
            }[props.type]
          }
        
        </div>
        <div>
            <span>{props.type}</span>
            <span>{props.count}</span>
        </div>
    </div>
  );
}

export default Stat;