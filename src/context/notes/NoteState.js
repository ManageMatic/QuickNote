import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
    const notesInitial = [
        {
            "_id": "684c2dff1c1e67cf2a2cd24a",
            "user": "678cd481ebb4398ef777b14a",
            "title": "Workout!",
            "description": "Do some Workout regularly.",
            "tag": "GYM",
            "date": "2025-06-13T13:56:15.951Z",
            "__v": 0
        },
        {
            "_id": "684c321cfbefc970469e4454",
            "user": "678cd481ebb4398ef777b14a",
            "title": "Workout!",
            "description": "Walk daily 3-4 km. updated",
            "tag": "GYM",
            "date": "2025-06-13T14:13:48.472Z",
            "__v": 0
        }
    ];

    const [notes, setNotes] = useState(notesInitial);

    return (
        <NoteContext.Provider value={{ notes, setNotes }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
