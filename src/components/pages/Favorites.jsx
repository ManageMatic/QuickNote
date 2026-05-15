import React, { useContext, useEffect, useState } from 'react';
import NoteContext from '../../context/notes/NoteContext';
import NoteItem from '../notes/NoteItem';
import SkeletonCard from '../notes/SkeletonCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import '../styles/Notes.css';
import UpdateNoteModal from '../notes/UpdateNoteModal';

const Favorites = ({ showAlert }) => {
  const { notes, getNotes, editNote, moveToTrash } = useContext(NoteContext);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      await getNotes();
      setTimeout(() => setLoading(false), 400);
    };
    fetchNotes();
  }, [getNotes]);

  const updateNote = (currentNote) => {
    setSelectedNote(currentNote);
    setModalOpen(true);
  };

  const favNotes = notes.filter(n => n.favorite && !n.trashed);

  return (
    <>
      <UpdateNoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        noteData={selectedNote}
        onSave={editNote}
        showAlert={showAlert}
      />
      <div className="dashboard-page">
        <div className="dashboard-main" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="notes-header">
            <h2 className="notes-heading">
              <FontAwesomeIcon icon={faStar} style={{ color: '#f59e0b', marginRight: '0.75rem' }} />
              Favorite Notes
            </h2>
          </div>

          <div className="notes-grid">
            {loading ? (
              Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : favNotes.length === 0 ? (
              <div className="notes-empty glass">
                <p>You haven't starred any notes yet.</p>
              </div>
            ) : (
              favNotes.map(n => (
                <NoteItem
                  key={n._id}
                  note={n}
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

export default Favorites;
