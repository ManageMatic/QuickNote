import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faEdit, faThumbtack, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NoteContext from '../context/notes/NoteContext';
import './styles/NoteItem.css';

const NoteItem = (props) => {
    const context = useContext(NoteContext);
    const { deleteNote, getNotes } = context;
    const { note, updateNote, showAlert } = props;

    const togglePin = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/notes/togglepin/${id}`, {
                method: 'PUT',
                credentials: 'include',
            });
            if (response.ok) {
                getNotes(); // Refresh notes after toggling pin
                showAlert("Note pin status toggled successfully", "success");
            }
        } catch (error) {
            console.error("Error toggling pin:", error);
            showAlert("Failed to toggle pin status", "danger");
        }
    }

    const toggleFavorite = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/notes/togglefavorite/${id}`, {
                method: 'PUT',
                credentials: 'include',
            });
            if (response.ok) {
                getNotes(); // Refresh notes after toggling favorite
                showAlert("Note favorite status toggled successfully", "success");
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            showAlert("Failed to toggle favorite status", "danger");
        }
    }
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
                        <FontAwesomeIcon
                            icon={faThumbtack}
                            className={`icon-pin mx-2 ${note.pinned ? 'text-dark' : 'text-muted'}`}
                            onClick={() => togglePin(note._id)}
                        />
                        <FontAwesomeIcon
                            icon={note.favorite ? solidStar : regularStar}
                            className="icon-favorite mx-2"
                            onClick={() => toggleFavorite(note._id)}
                        />
                        <FontAwesomeIcon
                            icon={faEdit}
                            className="icon-edit mx-2"
                            onClick={() => updateNote(note)}
                        />
                        <FontAwesomeIcon
                            icon={faTrashCan}
                            className="icon-delete mx-2"
                            onClick={() => {
                                deleteNote(note._id);
                                showAlert("Note deleted successfully", "success");
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteItem;
