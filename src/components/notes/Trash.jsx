import React, { useContext, useEffect, useState } from 'react';
import NoteContext from '../../context/notes/NoteContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashRestore, faTrashAlt, faTrash as faTrashIcon } from '@fortawesome/free-solid-svg-icons';
import SkeletonCard from './SkeletonCard';
import '../styles/Trash.css';

const Trash = ({ showAlert }) => {
  const { notes, getNotes, restoreNote, deleteNoteForever } = useContext(NoteContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      await getNotes();
      setTimeout(() => setLoading(false), 400);
    };
    fetchNotes();
  }, [getNotes]);

  const trashedNotes = notes.filter(n => n.trashed);

  return (
    <div className="trash-page">
      <div className="trash-header">
        <h2 className="trash-title"><FontAwesomeIcon icon={faTrashIcon} /> Trash</h2>
        <p className="trash-subtitle">Notes here will be kept until permanently deleted.</p>
      </div>

      <div className="trash-grid">
        {loading ? (
          Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : trashedNotes.length === 0 ? (
          <div className="trash-empty glass" style={{ gridColumn: '1/-1' }}>
            <p>Trash is empty</p>
          </div>
        ) : (
          trashedNotes.map(note => (
            <div key={note._id} className="note-card glass trashed">
              <div className="note-content">
                <h5 className="note-title">{note.title}</h5>
                <p className="note-description">{note.description}</p>
              </div>
              <div className="note-footer">
                <div className="note-actions-bottom">
                  <button className="btn-success-sm" onClick={() => { restoreNote(note._id); showAlert('Note restored', 'success'); }}>
                    <FontAwesomeIcon icon={faTrashRestore} /> Restore
                  </button>
                  <button className="btn-danger-sm" onClick={() => { deleteNoteForever(note._id); showAlert('Note deleted permanently', 'danger'); }}>
                    <FontAwesomeIcon icon={faTrashAlt} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Trash;
