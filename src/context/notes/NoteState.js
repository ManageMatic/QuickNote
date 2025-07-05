import { useState, useCallback } from 'react';
import NoteContext from './NoteContext';

const host = 'http://localhost:5000';

const NoteState = (props) => {
    /* -------- State -------- */
    const [notes, setNotes] = useState([]);
    const [trashedNotes, setTrashedNotes] = useState([]);

    /* -------- Add -------- */
    const addNote = async (title, description, tag) => {
        const res = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, tag })
        });
        const note = await res.json();
        setNotes(prev => prev.concat(note));
    };

    /* -------- Fetch All (non‑trashed) -------- */
    const getNotes = useCallback(async () => {
        try {
            const res = await fetch(`${host}/api/notes/fetchallnotes`, {
                method: 'GET',
                credentials: 'include'
            });
            if (res.ok) {
                setNotes(await res.json());
                return true;
            }
            /* silent refresh once */
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
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    }, []);

    /* -------- Edit -------- */
    const editNote = async (id, title, description, tag) => {
        await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, tag })
        });
        setNotes(prev =>
            prev.map(n => (n._id === id ? { ...n, title, description, tag } : n))
        );
    };

    /* -------- Move to Trash (soft‑delete) -------- */
    const moveToTrash = async (id) => {
        const res = await fetch(`${host}/api/notes/trash/${id}`, {
            method: 'PUT',
            credentials: 'include'
        });
        if (res.ok) {
            setNotes(prev => prev.filter(n => n._id !== id));
            const trashed = await res.json();           // returns the note or msg
            setTrashedNotes(prev => prev.concat(trashed));
        }
    };

    /* -------- Restore from Trash -------- */
    const restoreNote = async (id) => {
        const res = await fetch(`${host}/api/notes/restore/${id}`, {
            method: 'PUT',
            credentials: 'include'
        });
        if (res.ok) {
            const restored = await res.json();
            setTrashedNotes(prev => prev.filter(n => n._id !== id));
            setNotes(prev => prev.concat(restored));
        }
    };

    /* -------- Permanently delete -------- */
    const deleteNoteForever = async (id) => {
        const res = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (res.ok) {
            setTrashedNotes(prev => prev.filter(n => n._id !== id));
        }
    };

    /* -------- Fetch all trashed -------- */
    const getTrashedNotes = async () => {
        try {
            const res = await fetch(`${host}/api/notes/trash`, {
                method: 'GET',
                credentials: 'include'
            });
            if (res.ok) {
                setTrashedNotes(await res.json());
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    return (
        <NoteContext.Provider
            value={{ notes, addNote, getNotes, editNote, moveToTrash, trashedNotes, getTrashedNotes, restoreNote, deleteNoteForever }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
