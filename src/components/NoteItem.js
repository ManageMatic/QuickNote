import React, {useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NoteContext from '../context/notes/NoteContext';

const NoteItem = (props) => {
    const context = useContext(NoteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
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
                        <FontAwesomeIcon icon={faPen} className="mx-2 text-primary" onClick={()=>{updateNote(note)}} />
                        <FontAwesomeIcon icon={faTrashCan} className="mx-2 text-danger" onClick={()=>{deleteNote(note._id)}} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteItem;
