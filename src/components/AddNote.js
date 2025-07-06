import React, { useContext, useState } from 'react'
import NoteContext from '../context/notes/NoteContext';
import './styles/AddNote.css';

const AddNote = (props) => {
    const context = useContext(NoteContext);
    const { addNote } = context;

    const [note, setNote] = useState({ title: "", description: "", tag: "", reminder: "" });

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag, note.reminder);
        setNote({ title: "", description: "", tag: "", reminder: "" });
        props.showAlert("Note added successfully", "success");
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    }
    return (
        <div className="container my-3">
            <h1>Add a Note!</h1>
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name='title' value={note.title} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea type="text" className="form-control" id="description" name='description' value={note.description} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name='tag' value={note.tag} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="reminder" className="form-label">Set Reminder</label>
                    <input type="datetime-local" className="form-control" id="reminder" name='reminder' value={note.reminder} onChange={onChange} />
                </div>
                <button type="submit" disabled={note.title.length === 0 || note.description.length === 0} className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote
