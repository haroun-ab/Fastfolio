import React from 'react';
import '../styles/components/Button.css'
function Button(props) {
  if (props.tagName == 'input'){
    return (
      <props.tagName className='button' id={props.id} href={props.href} 
      onClick={props.onClick} type={props.type} value={props.btnValue}/>
    );
  } else {
    return (
      <props.tagName className='button' href={props.href} id={props.id} 
      onClick={props.onClick} type={props.type}>
        {props.btnValue}
      </props.tagName>
    );
  }
}
export default Button;

