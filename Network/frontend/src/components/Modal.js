import React from 'react';
import "./Modal.css"

const Modal = ({ onClose, sendChanges, open, bio, image }) => {

    if (!open) {
        return null
    }

    return (
        <>
        <div className="overlay"></div>
        <div className="modal">
            <div className="modal__bio">
                <h3>Bio:</h3>
                <textarea defaultValue={ bio }></textarea>
            </div>
            <div className="modal__image">
                <h3>Image(URL):</h3>
                <textarea defaultValue={ image } />
            </div>
            <div className="modal__bottom">
                <button className="modal__buttonClose" onClick={ onClose }>Close</button>
                <button className="modal__buttonSave" onClick={ sendChanges }>Save</button>
            </div>
        </div>
        </>
    );
}

export default Modal