import { useState, useCallback, useRef, useEffect } from 'react';
import NoteContext from './NoteContext';
import { toast } from 'react-toastify';

const host = 'http://localhost:5000';

const NoteState = (props) => {
    /* -------- State -------- */
    const [notes, setNotes] = useState([]);

    /* -------- Add -------- */
    const addNote = async (title, description, tag, reminder, color) => {
        const res = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, tag, reminder, color })
        });
        const note = await res.json();
        setNotes(prev => prev.concat(note));
    };

    /* -------- Fetch All (including trashed) -------- */
    const getNotes = useCallback(async () => {
        try {
            const fetchAll = async () => {
                const res = await fetch(`${host}/api/notes/fetchallnotes`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!res.ok) return null;

                const list = await res.json();
                setNotes(list);
                notesRef.current = list;
                return true;
            };

            if (await fetchAll()) return true;

            const refresh = await fetch(`${host}/api/auth/refresh-token`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!refresh.ok) return false;

            return await fetchAll();
        } catch (err) {
            console.error(err);
            return false;
        }
    }, []);

    const notesRef = useRef([]);
    const notified = useRef(new Set());

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            notesRef.current.forEach(note => {
                if (
                    note.reminder &&
                    !note.trashed &&
                    !notified.current.has(note._id)
                ) {
                    const diff = new Date(note.reminder) - now;
                    if (diff >= 0 && diff < 60000) {
                        toast.info(`Reminder: ${note.title}`, {
                            position: 'top-right',
                            autoClose: 5000,
                            closeOnClick: true,
                        });
                        notified.current.add(note._id);
                    }
                }
            });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    /* -------- Edit -------- */
    const editNote = async (id, title, description, tag, color) => {
        await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, tag, color })
        });
        setNotes(prev =>
            prev.map(n => (n._id === id ? { ...n, title, description, tag, color } : n))
        );
    };

    /* -------- Toggle Pin -------- */
    const togglePin = async (id) => {
        const res = await fetch(`${host}/api/notes/togglepin/${id}`, {
            method: 'PUT',
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();
            setNotes(prev => prev.map(n => n._id === id ? { ...n, pinned: data.pinned } : n));
        }
    };

    /* -------- Toggle Favorite -------- */
    const toggleFavorite = async (id) => {
        const res = await fetch(`${host}/api/notes/togglefavorite/${id}`, {
            method: 'PUT',
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();
            setNotes(prev => prev.map(n => n._id === id ? { ...n, favorite: data.favorite } : n));
        }
    };

    /* -------- Move to Trash (soft‑delete) -------- */
    const moveToTrash = async (id) => {
        const res = await fetch(`${host}/api/notes/trash/${id}`, {
            method: 'PUT',
            credentials: 'include'
        });
        if (res.ok) {
            setNotes(prev => prev.map(n => n._id === id ? { ...n, trashed: true } : n));
        }
    };

    /* -------- Restore from Trash -------- */
    const restoreNote = async (id) => {
        const res = await fetch(`${host}/api/notes/restore/${id}`, {
            method: 'PUT',
            credentials: 'include'
        });
        if (res.ok) {
            setNotes(prev => prev.map(n => n._id === id ? { ...n, trashed: false } : n));
        }
    };

    /* -------- Permanently delete -------- */
    const deleteNoteForever = async (id) => {
        const res = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (res.ok) {
            setNotes(prev => prev.filter(n => n._id !== id));
        }
    };

    /* -------- Logout -------- */
    const logout = async () => {
        await fetch(`${host}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        setNotes([]);
    };

    return (
        <NoteContext.Provider
            value={{ 
                notes, addNote, getNotes, editNote, togglePin, toggleFavorite,
                moveToTrash, restoreNote, deleteNoteForever,
                logout 
            }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
