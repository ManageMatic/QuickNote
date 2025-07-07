import React, { useContext, useEffect, useRef, useState } from 'react';
import NoteContext from '../context/notes/NoteContext';
import NoteItem from './NoteItem';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import './styles/Notes.css';

const Notes = (props) => {
    const context = useContext(NoteContext);
    const { notes, getNotes, editNote, moveToTrash } = context;
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
    const [sortType, setSortType] = useState('date');

    const sortedNotes = [...notes]
        .sort((a, b) => {
            // Always sort pinned notes to top first
            if (a.pinned !== b.pinned) return b.pinned - a.pinned;

            // Then apply selected sorting
            if (sortType === 'title') return a.title.localeCompare(b.title);
            if (sortType === 'tag') return a.tag.localeCompare(b.tag);
            return new Date(b.date) - new Date(a.date); // default: date
        });

    const filteredNotes = sortedNotes.filter(note =>
        (note.title || '').toLowerCase().includes(query.toLowerCase()) ||
        (note.description || '').toLowerCase().includes(query.toLowerCase())
    );

    const visibleNotes = Array.isArray(filteredNotes)
        ? filteredNotes.filter(note => !note.trashed)
        : [];

    return (
        <>
            <div className="display-seciton">
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
                                        <textarea type="text" className="form-control" id="edescription" name='edescription' value={note.edescription} onChange={onChange} />
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
                <div className="notes-container row">
                    <div className="notes-header mb-3">
                        <h1 className="notes-title">Your Notes!</h1>
                        <div className="notes-tools">
                            <SearchBar query={query} setQuery={setQuery} />
                            <select
                                value={sortType}
                                onChange={(e) => setSortType(e.target.value)}
                                className="notes-sort-select"
                            >
                                <option value="date">Sort by Date</option>
                                <option value="title">Sort by Title</option>
                                <option value="tag">Sort by Tag</option>
                            </select>
                        </div>
                    </div>
                    <div className="notes-scrollable">
                        {visibleNotes.length === 0 ? (
                            <div className="container">No notes to display!</div>
                        ) : (
                            visibleNotes.map(note => (
                                <NoteItem
                                    note={note}
                                    key={note._id}
                                    updateNote={updateNote}
                                    moveToTrash={moveToTrash}
                                    showAlert={showAlert}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notes;
