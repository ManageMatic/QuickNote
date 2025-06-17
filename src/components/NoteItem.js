import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NoteContext from '../context/notes/NoteContext';
import './styles/NoteItem.css';

const NoteItem = (props) => {
    const context = useContext(NoteContext);
    const { deleteNote } = context;
    const { note, updateNote, showAlert } = props;
    return (
        <div className="col-md-3">
            <div className="custom-card my-3">
                <div className="card-body">
                    <h5 className="card-title note-title">{note.title}</h5>
                    <p className="card-text note-description">{note.description}</p>
                    <p className="card-text">
                        <small className="note-tag text-muted">{note.tag}</small>
                    </p>
                    <div className="d-flex justify-content-end">
                        <FontAwesomeIcon icon={faPen} className="icon-edit mx-1" onClick={() => updateNote(note)} />
                        <FontAwesomeIcon icon={faTrashCan} className="icon-delete mx-1" onClick={() => { deleteNote(note._id); showAlert("Note deleted successfully", "success"); }} />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default NoteItem;
