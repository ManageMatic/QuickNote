import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
    const notesInitial = [
        {
            "_id": "684c2dff1c1env67cf2a2cd24a",
            "user": "678cd481ebb4398ef777b14a",
            "title": "Workout!",
            "description": "Do some Workout regularly.",
            "tag": "GYM",
            "date": "2025-06-13T13:56:15.951Z",
            "__v": 0
        },
        {
            "_id": "684zc321cfbefc970469e4454",
            "user": "678cd481ebb4398ef777b14a",
            "title": "Workout!",
            "description": "Walk daily 3-4 km. updated",
            "tag": "GYM",
            "date": "2025-06-13T14:13:48.472Z",
            "__v": 0
        },
        {
            "_id": "684c2dff1c1e67cf2a2cdg24a",
            "user": "678cd481ebb4398ef777b14a",
            "title": "Workout!",
            "description": "Do some Workout regularly.",
            "tag": "GYM",
            "date": "2025-06-13T13:56:15.951Z",
            "__v": 0
        },
        {
            "_id": "684c321cfbhefc970469e4454",
            "user": "678cd481ebb4398ef777b14a",
            "title": "Workout!",
            "description": "Walk daily 3-4 km. updated",
            "tag": "GYM",
            "date": "2025-06-13T14:13:48.472Z",
            "__v": 0
        },{
            "_id": "684c2dff1cg1e67cf2a2cd24a",
            "user": "678cd481ebb4398ef777b14a",
            "title": "Workout!",
            "description": "Do some Workout regularly.",
            "tag": "GYM",
            "date": "2025-06-13T13:56:15.951Z",
            "__v": 0
        },
        {
            "_id": "684c321cfbefc97gf0469e4454",
            "user": "678cd481ebb4398ef777b14a",
            "title": "Workout!",
            "description": "Walk daily 3-4 km. updated",
            "tag": "GYM",
            "date": "2025-06-13T14:13:48.472Z",
            "__v": 0
        },
    ];

    const [notes, setNotes] = useState(notesInitial);

    // Add a note
    const addNote = (title, description, tag) => {
        //todo: API call
        console.log("Adding a new note", title, description, tag);
        const note = {
            "_id": "684c321cfbefc97gf0469e4454",
            "user": "678cd481ebb4398ef777b14a",
            "title": title,
            "description": description,
            "tag": tag,
            "date": "2025-06-13T14:13:48.472Z",
            "__v": 0
        };
        setNotes(notes.concat(note));
    }

    //Delete a note
    const deleteNote = (id) => {

    }

    //Edit a note
    const editNote = (id, title, description, tag) => {
        
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
