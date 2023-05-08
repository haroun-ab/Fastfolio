import React from 'react';
import '../styles/Button.css'
function Button(props) {
  return (
    <a className='button' href={props.href}>
      {props.btnValue}
    </a>
  );
}

export default Button;