import React, { useContext, useEffect, useState } from 'react';
import NoteContext from '../../context/notes/NoteContext';
import NoteItem from '../notes/NoteItem';
import SkeletonCard from '../notes/SkeletonCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Notes.css';
import UpdateNoteModal from '../notes/UpdateNoteModal';

const Reminders = ({ showAlert }) => {
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

  // Filter notes that have a reminder and are not trashed
  const upcomingReminders = notes.filter(n => n.reminder && !n.reminderSent && new Date(n.reminder) > new Date() && !n.trashed).sort((a, b) => new Date(a.reminder) - new Date(b.reminder));
  const pastReminders = notes.filter(n => n.reminder && (n.reminderSent || new Date(n.reminder) <= new Date()) && !n.trashed).sort((a, b) => new Date(b.reminder) - new Date(a.reminder));

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
              <FontAwesomeIcon icon={faCalendarAlt} style={{ color: 'var(--accent-light)', marginRight: '0.75rem' }} />
              Reminders Dashboard
            </h2>
            <p className="notes-subtitle" style={{ color: 'var(--text-3)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Manage your scheduled tasks and notification history.
            </p>
          </div>

          <div className="reminders-container">
            {/* ── Upcoming Reminders ── */}
            <div className="reminder-section">
              <h3 className="section-label-alt">Upcoming</h3>
              <div className="notes-grid">
                {loading ? (
                  Array(2).fill(0).map((_, i) => <SkeletonCard key={i} />)
                ) : upcomingReminders.length === 0 ? (
                  <div className="notes-empty glass" style={{ gridColumn: '1/-1' }}>
                    <p>No upcoming reminders scheduled.</p>
                  </div>
                ) : (
                  upcomingReminders.map(n => (
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

            {/* ── Past/Sent Reminders ── */}
            {pastReminders.length > 0 && (
              <div className="reminder-section" style={{ marginTop: '4rem' }}>
                <h3 className="section-label-alt">Completed / History</h3>
                <div className="notes-grid">
                  {pastReminders.map(n => (
                    <div key={n._id} style={{ opacity: 0.7 }}>
                      <NoteItem
                        note={n}
                        updateNote={updateNote}
                        moveToTrash={moveToTrash}
                        showAlert={showAlert}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Reminders;
