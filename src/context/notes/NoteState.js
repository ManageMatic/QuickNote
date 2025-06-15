import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
    const host = "http://localhost:5000";
    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial);

    // Add a note
    const addNote = async (title, description, tag) => {
        //API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc4Y2Q0ODFlYmI0Mzk4ZWY3NzdiMTRhIn0sImlhdCI6MTczNzI4NDU4Mn0.ojYrhJr6OlJk8V_3KZflqDCFrM8lDJ0Ls14rDhFOy-w"
            },
            body: JSON.stringify({ title, description, tag })
        });
        const note = {
            title,
            description,
            tag,
            _id: (await response.json())._id
        };
        setNotes(notes.concat(note));
    }

    // Get all notes
    const getNotes = async () => {
        //API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc4Y2Q0ODFlYmI0Mzk4ZWY3NzdiMTRhIn0sImlhdCI6MTczNzI4NDU4Mn0.ojYrhJr6OlJk8V_3KZflqDCFrM8lDJ0Ls14rDhFOy-w"//localStorage.getItem('token')
            }
        });
        const json = await response.json();
        setNotes(json);
    }

    //Delete a note
    const deleteNote = (id) => {
        //API call
        const response = fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc4Y2Q0ODFlYmI0Mzk4ZWY3NzdiMTRhIn0sImlhdCI6MTczNzI4NDU4Mn0.ojYrhJr6OlJk8V_3KZflqDCFrM8lDJ0Ls14rDhFOy-w"
            }
        });
        const newNotes = notes.filter((note) => { return note._id !== id });
        setNotes(newNotes);
        return response;
    }

    //Edit a note
    const editNote = async (id, title, description, tag) => {
        //API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc4Y2Q0ODFlYmI0Mzk4ZWY3NzdiMTRhIn0sImlhdCI6MTczNzI4NDU4Mn0.ojYrhJr6OlJk8V_3KZflqDCFrM8lDJ0Ls14rDhFOy-w"
            },
            body: JSON.stringify({ title, description, tag })
        });
        return response.json()
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, getNotes, deleteNote, editNote }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
