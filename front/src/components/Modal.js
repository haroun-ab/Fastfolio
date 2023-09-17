import React, {useEffect} from "react";
import '../styles/home.css'

function Modal (props) {

function closeModal(event){
  event.target.parentNode.parentNode.style.display = "none";
}

    return(
        <div className={'backdrop ' + props.className}>
            <div className="modal">
            {props.closable == "no" ? <br/> : <img src="/xmark.svg" className="close-modal-btn" onClick={closeModal}/>}
              
                {props.content}
            </div>
        </div>
    );
}

export default Modal;