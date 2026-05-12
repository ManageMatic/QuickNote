import React, { useContext, useEffect, useState } from 'react';
import NoteContext from '../../context/notes/NoteContext';
import NoteItem from './NoteItem';
import SearchBar from './SearchBar';
import SkeletonCard from './SkeletonCard';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faPalette } from '@fortawesome/free-solid-svg-icons';
import '../styles/Notes.css';

import UpdateNoteModal from './UpdateNoteModal';

const Notes = ({ showAlert }) => {
  const { notes, getNotes, editNote, moveToTrash } = useContext(NoteContext);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sortType, setSortType] = useState('date');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      const shouldShowSkeleton = notes.length === 0;
      if (shouldShowSkeleton) setLoading(true);

      
      await getNotes();
      
      if (shouldShowSkeleton) {
        setTimeout(() => setLoading(false), 500);
      } else {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [getNotes, notes.length]);

  const updateNote = (currentNote) => {
    setSelectedNote(currentNote);
    setModalOpen(true);
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return b.pinned - a.pinned;
    if (sortType === 'title') return a.title.localeCompare(b.title);
    if (sortType === 'tag')   return a.tag.localeCompare(b.tag);
    return new Date(b.date) - new Date(a.date);
  });

  const visibleNotes = sortedNotes
    .filter(n => !n.trashed)
    .filter(n =>
      (n.title || '').toLowerCase().includes(query.toLowerCase()) ||
      (n.description || '').toLowerCase().includes(query.toLowerCase())
    );

  return (
    <>
      <UpdateNoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        noteData={selectedNote}
        onSave={editNote}
        showAlert={showAlert}
      />


      <div className="notes-panel">
        <div className="notes-header">
          <h2 className="notes-heading">Your Notes</h2>
          <div className="notes-tools">
            <SearchBar query={query} setQuery={setQuery} />
            <select
              className="notes-sort-select input-dark"
              value={sortType}
              onChange={e => setSortType(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="tag">Tag</option>
            </select>
          </div>
        </div>

        <div className="notes-grid">
          {loading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : visibleNotes.length === 0 ? (
            <div className="notes-empty">
              <p>No notes yet — add one!</p>
            </div>
          ) : (
            visibleNotes.map(n => (
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
    </>
  );
};

export default Notes;
