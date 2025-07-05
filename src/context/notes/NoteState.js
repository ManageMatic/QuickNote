import { useState, useCallback } from 'react';
import NoteContext from './NoteContext';

const host = 'http://localhost:5000';

const NoteState = (props) => {
    const [notes, setNotes] = useState([]);

    /* ---------- Add a Note ---------- */
    const addNote = async (title, description, tag) => {
        const res = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, tag })
        });
        const note = await res.json();
        setNotes((prev) => prev.concat(note));
    };

    /* ---------- Get All Notes ---------- */
    const getNotes = useCallback(async () => {
        try {
            const res = await fetch(`${host}/api/notes/fetchallnotes`, {
                method: 'GET',
                credentials: 'include'
            });

            if (res.ok) {
                setNotes(await res.json());
                return true;                   // success
            }

            // Try silent refresh once
            const refresh = await fetch(`${host}/api/auth/refresh-token`, {
                method: 'POST',
                credentials: 'include'
            });

            if (refresh.ok) {
                const retry = await fetch(`${host}/api/notes/fetchallnotes`, {
                    method: 'GET',
                    credentials: 'include'
                });
                setNotes(await retry.json());
                return true;                   // success after refresh
            }

            return false; // refresh failed → caller should redirect
        } catch (err) {
            console.error(err);
            return false;
        }
    }, []);

    /* ---------- Delete Note ---------- */
    const deleteNote = async (id) => {
        await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        setNotes((prev) => prev.filter((n) => n._id !== id));
    };

    /* ---------- Edit Note ---------- */
    const editNote = async (id, title, description, tag) => {
        await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, tag })
        });

        setNotes((prev) =>
            prev.map((n) =>
                n._id === id ? { ...n, title, description, tag } : n
            )
        );
    };

    return (
        <NoteContext.Provider value={{ notes, addNote, getNotes, deleteNote, editNote }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
