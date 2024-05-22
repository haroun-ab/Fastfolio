import React, { } from 'react';
import '../styles/components/FormField.css'
import { FaInfoCircle } from 'react-icons/fa';


function FormField(props) {
  if (props.value != null) {
    return (
      <props.fieldTagName type={props.type} placeholder={props.placeholder} id={props.id} readOnly={props.readOnly} onChange={props.onChange} name={props.name} value={props.value}></props.fieldTagName>
  );
  }else {
    return (
      <props.fieldTagName type={props.type} placeholder={props.placeholder} id={props.id} readOnly={props.readOnly} onChange={props.onChange} name={props.name} defaultValue={props.defaultValue}></props.fieldTagName>
    );
  }

  
}

export default FormField;