import React, { } from 'react';
import '../styles/FormField.css'
import { FaInfoCircle } from 'react-icons/fa';

function FormField(props) {
  return (
      <props.fieldTagName type={props.type} placeholder={props.placeholder} id={props.id}></props.fieldTagName>
      
    
  );
}

export default FormField;