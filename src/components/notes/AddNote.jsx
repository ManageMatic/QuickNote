import React, { useContext, useState } from 'react';
import NoteContext from '../../context/notes/NoteContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faClock, faTag, faHeading, faPalette } from '@fortawesome/free-solid-svg-icons';
import '../styles/AddNote.css';

const AddNote = ({ showAlert }) => {
  const { addNote } = useContext(NoteContext);
  const [note, setNote] = useState({ title: '', description: '', tag: '', reminder: '', color: 'transparent' });
  const [expanded, setExpanded] = useState(false);

  const colors = [
    { name: 'Default', value: 'transparent' },
    { name: 'Purple',  value: 'rgba(124, 58, 237, 0.2)' },
    { name: 'Blue',    value: 'rgba(56, 189, 248, 0.2)' },
    { name: 'Green',   value: 'rgba(16, 185, 129, 0.2)' },
    { name: 'Pink',    value: 'rgba(236, 72, 153, 0.2)' },
    { name: 'Yellow',  value: 'rgba(245, 158, 11, 0.2)' },
  ];

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag, note.reminder, note.color);
    setNote({ title: '', description: '', tag: '', reminder: '', color: 'transparent' });
    setExpanded(false);
    showAlert('Note added successfully', 'success');
  };

  const onChange = (e) => setNote({ ...note, [e.target.name]: e.target.value });
  const onDescriptionChange = (content) => setNote({ ...note, description: content });
  const onColorSelect = (colorValue) => setNote({ ...note, color: colorValue });

  const canSubmit = note.title.length > 0 && note.description.replace(/<(.|\n)*?>/g, '').trim().length > 0;

  const editorRef = React.useRef(null);

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  return (
    <div className="addnote-wrap">
      <div className="addnote-header">
        <h2 className="addnote-title">Add Note</h2>
        <p className="addnote-subtitle">Capture your idea with style</p>
      </div>

      <form className="addnote-form" onSubmit={handleClick}>
        <div className="addnote-field">
          <FontAwesomeIcon icon={faHeading} className="addnote-field-icon" />
          <input
            type="text"
            name="title"
            className="input-dark addnote-input"
            placeholder="Note title..."
            value={note.title}
            onChange={onChange}
            onFocus={() => setExpanded(true)}
          />
        </div>

        <div className={`addnote-expandable ${expanded ? 'open' : ''}`}>
          <div className="addnote-quill-wrap">
            <ReactQuill
              ref={editorRef}
              theme="snow"
              value={note.description}
              onChange={onDescriptionChange}
              modules={quillModules}
              placeholder="What's on your mind? (Rich text supported)"
              className="qn-quill-editor"
            />
          </div>

          <div className="addnote-row">
            <div className="addnote-field">
              <FontAwesomeIcon icon={faTag} className="addnote-field-icon" />
              <input
                type="text"
                name="tag"
                className="input-dark addnote-input"
                placeholder="Tag..."
                value={note.tag}
                onChange={onChange}
              />
            </div>

            <div className="addnote-field">
              <FontAwesomeIcon icon={faClock} className="addnote-field-icon" />
              <input
                type="datetime-local"
                name="reminder"
                className="input-dark addnote-input"
                value={note.reminder}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="addnote-color-picker">
            <label className="color-label"><FontAwesomeIcon icon={faPalette} /> Color:</label>
            <div className="color-options">
              {colors.map(c => (
                <button
                  key={c.name}
                  type="button"
                  className={`color-dot ${note.color === c.value ? 'active' : ''}`}
                  style={{ background: c.value === 'transparent' ? 'rgba(255,255,255,0.1)' : c.value }}
                  onClick={() => onColorSelect(c.value)}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="addnote-actions">
            <button
              type="button"
              className="btn-ghost addnote-cancel"
              onClick={() => { setExpanded(false); setNote({ title: '', description: '', tag: '', reminder: '', color: 'transparent' }); }}
            >
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </button>
            <button type="submit" className="btn-primary-glow" disabled={!canSubmit}>
              <FontAwesomeIcon icon={faPlus} /> Add Note
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNote;
