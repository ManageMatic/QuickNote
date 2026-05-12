import React, { useContext } from 'react';
import NoteContext from '../../context/notes/NoteContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faStar, faThumbtack, faCopy } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import '../styles/NoteItem.css';

const NoteItem = ({ note, updateNote, moveToTrash, showAlert }) => {
  const context = useContext(NoteContext);
  const { togglePin, toggleFavorite } = context;

  const handleCopy = () => {
    // Strip HTML for plain text clipboard copy
    const plainText = note.description.replace(/<(.|\n)*?>/g, '');
    navigator.clipboard.writeText(plainText);
    showAlert('Text copied to clipboard', 'success');
  };

  const cardStyle = {
    background: note.color !== 'transparent' ? `${note.color}` : 'var(--bg-card)',
    borderColor: note.color !== 'transparent' ? `${note.color.replace('0.2', '0.4')}` : 'var(--border)'
  };

  return (
    <div className={`note-card glass ${note.pinned ? 'pinned' : ''}`} style={cardStyle}>
      {note.color !== 'transparent' && (
        <div className="note-color-accent" style={{ background: note.color.replace('0.2', '1') }} />
      )}
      
      <div className="note-card-header">
        <span className="note-tag">{note.tag || 'General'}</span>
        <div className="note-actions-top">
          <button 
            className={`btn-icon pin-btn ${note.pinned ? 'active' : ''}`} 
            onClick={() => togglePin(note._id)}
            title={note.pinned ? "Unpin" : "Pin to top"}
          >
            <FontAwesomeIcon icon={faThumbtack} />
          </button>
          <button 
            className={`btn-icon fav-btn ${note.favorite ? 'active' : ''}`} 
            onClick={() => toggleFavorite(note._id)}
            title={note.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <FontAwesomeIcon icon={note.favorite ? faStar : faStarRegular} />
          </button>
        </div>
      </div>

      <div className="note-content">
        <h3 className="note-title">{note.title}</h3>
        <div 
          className="note-description rich-text-content" 
          dangerouslySetInnerHTML={{ __html: note.description }}
        />
      </div>

      <div className="note-footer">
        <span className="note-date">{new Date(note.date).toLocaleDateString()}</span>
        <div className="note-actions-bottom">
          <button className="btn-icon copy-btn" onClick={handleCopy} title="Copy as plain text">
            <FontAwesomeIcon icon={faCopy} />
          </button>
          <button className="btn-icon edit-btn" onClick={() => updateNote(note)} title="Edit note">
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button className="btn-icon delete-btn" onClick={() => moveToTrash(note._id)} title="Move to trash">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
