import React, { useContext, useEffect, useRef, useState } from 'react';
import NoteContext from '../context/notes/NoteContext';
import NoteItem from './NoteItem';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import './styles/Notes.css';

const Notes = (props) => {
    const context = useContext(NoteContext);
    const { notes, getNotes, editNote } = context;
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { showAlert } = props;

    useEffect(() => {
        const fetchNotes = async () => {
            const ok = await getNotes();
            if (!ok) {
                showAlert('Session expired. Please log in again.', 'danger');
                navigate('/login');
            }
        };
        fetchNotes();
    }, [getNotes, navigate, showAlert]);

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({ _id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
    };

    const handleClick = (e) => {
        e.preventDefault();
        refClose.current.click();
        editNote(note._id, note.etitle, note.edescription, note.etag);
        setNote({ id: "", etitle: "", edescription: "", etag: "" });
        props.showAlert("Note updated successfully", "success");
    };

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    const ref = useRef(null);
    const refClose = useRef(null);
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "Default" });

    // 🔍 Filter notes by search query
    const filteredNotes = notes.filter(n =>
        [n.title, n.description, n.tag].some(field =>
            field.toLowerCase().includes(query.toLowerCase())
        )
    );

    return (
        <>
            <div className="container my-3">
                <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Launch demo modal
                </button>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Update Your Note!</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="etitle" className="form-label">Title</label>
                                        <input type="text" className="form-control" id="etitle" name='etitle' value={note.etitle} onChange={onChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="edescription" className="form-label">Description</label>
                                        <input type="text" className="form-control" id="edescription" name='edescription' value={note.edescription} onChange={onChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="etag" className="form-label">Tag</label>
                                        <input type="text" className="form-control" id="etag" name='etag' value={note.etag} onChange={onChange} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className='notes-header'>
                        <h1>Your Notes!</h1>
                        <SearchBar query={query} setQuery={setQuery} />
                    </div>
                    {!Array.isArray(filteredNotes) || filteredNotes.length === 0 ? (
                        <div className="container">No notes to display!</div>
                    ) : (
                        filteredNotes.map(note => (
                            <NoteItem
                                key={note._id}
                                note={note}
                                updateNote={updateNote}
                                showAlert={showAlert}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Notes;
