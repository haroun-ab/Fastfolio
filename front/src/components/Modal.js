import React, {useEffect} from "react";
import '../styles/components/Modal.css'

function Modal (props) {

    function closeModal(event){
        event.target.parentNode.parentNode.style.display = "none";
        if (props.resetable && event.target.parentNode.parentNode.querySelector('form')) {
            event.target.parentNode.parentNode.querySelector('form').reset();
        }

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