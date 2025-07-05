import React, { useContext, useEffect } from 'react';
import NoteContext from '../context/notes/NoteContext';
import { useNavigate } from 'react-router-dom';
import './styles/Trash.css';

const Trash = ({ showAlert }) => {
    const context = useContext(NoteContext);
    const { trashedNotes = [], getTrashedNotes, restoreNote, deleteNoteForever } = context;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrash = async () => {
            const ok = await getTrashedNotes();
            if (!ok) {
                showAlert('Session expired. Please log in again.', 'danger');
                navigate('/login');
            }
        };
        fetchTrash();
    }, [getTrashedNotes, navigate, showAlert]);

    const handleRestore = async (id) => {
        await restoreNote(id);
        showAlert("Note restored", "success");
        await getTrashedNotes();
    };

    const handleDeleteForever = async (id) => {
        await deleteNoteForever(id);
        showAlert("Note permanently deleted", "success");
        await getTrashedNotes();
    };

    return (
        <div className="container trash-container" style={{ marginTop: '70px' }}>
            <h1 className="my-3">Trashed Notes</h1>
            {trashedNotes.length === 0 ? (
                <p>No notes in trash.</p>
            ) : (
                <div className="row">
                    {trashedNotes.map(note => (
                        <div className="col-md-3" key={note._id}>
                            <div className="custom-card my-3">
                                <div className="card-body">
                                    <h5 className="card-title note-title">{note.title}</h5>
                                    <p className="card-text note-description">{note.description}</p>
                                    <p className="card-text">
                                        <small className="note-tag text-muted">{note.tag}</small>
                                    </p>
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => handleRestore(note._id)}
                                        >
                                            Restore
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteForever(note._id)}
                                        >
                                            Delete Forever
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Trash;
