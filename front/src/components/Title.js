import React from 'react';
import '../styles/components/Title.css'
function Title(props) {
  return (
    <div className='title'>
        <h2>{props.value}</h2>
        <div className='title-decoration'></div>
    </div>
  );
}

export default Title;