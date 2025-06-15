import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';

const NoteItem = (props) => {
    const { note } = props;
    return (
        <div className='col-md-3'>
            <div className="card my-3">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                    <p className="card-text">
                        <small className="text-muted">{note.tag}</small>
                    </p>
                    <div className="d-flex justify-content-end">
                        <FontAwesomeIcon icon={faPen} className="mx-2 text-primary" />
                        <FontAwesomeIcon icon={faTrashCan} className="mx-2 text-danger" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteItem;
