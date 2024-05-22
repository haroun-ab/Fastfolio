import React, { useEffect }  from "react";
import {FaEye,FaEdit, FaCogs, FaChartPie} from 'react-icons/fa'

import Button from "../components/Button";
import  "../styles/components/Header.css";

function Section(props) { 
  let logo = 0;
  switch (props.sectionName) {
    case "Edit my portfolio":
      logo = <FaEdit/>
    break;
    case "Visualize my portfolio":
      logo = <FaEye/>
    break;
    case "Statistics":
      logo = <FaChartPie/>
    break;
    case "Settings":
      logo = <FaCogs/>
    break;

    default:
      break;
  }
  return (
    <a href={props.href} className="section-dashboard">
      {logo}
      <div>{props.sectionName}</div>
      <div></div>
    </a>
  );
}

export default Section;
