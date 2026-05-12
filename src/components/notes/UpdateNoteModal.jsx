import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faPalette, faFolder } from '@fortawesome/free-solid-svg-icons';
import NoteContext from '../../context/notes/NoteContext';
import { useContext } from 'react';

const UpdateNoteModal = ({ isOpen, onClose, noteData, onSave, showAlert }) => {
  const { folders } = useContext(NoteContext);
  const [note, setNote] = useState({ _id: '', etitle: '', edescription: '', etag: '', ecolor: 'transparent', efolder: '' });

  const colors = [
    { name: 'Default', value: 'transparent' },
    { name: 'Purple',  value: 'rgba(124, 58, 237, 0.2)' },
    { name: 'Blue',    value: 'rgba(56, 189, 248, 0.2)' },
    { name: 'Green',   value: 'rgba(16, 185, 129, 0.2)' },
    { name: 'Pink',    value: 'rgba(236, 72, 153, 0.2)' },
    { name: 'Yellow',  value: 'rgba(245, 158, 11, 0.2)' },
  ];

  useEffect(() => {
    if (noteData) {
      setNote({
        _id: noteData._id,
        etitle: noteData.title,
        edescription: noteData.description,
        etag: noteData.tag,
        ecolor: noteData.color || 'transparent',
        efolder: noteData.folder || ''
      });
    }
  }, [noteData]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave(note._id, note.etitle, note.edescription, note.etag, note.ecolor, note.efolder);
    onClose();
    showAlert('Note updated successfully', 'success');
  };

  const onChange = (e) => setNote({ ...note, [e.target.name]: e.target.value });
  const onDescriptionChange = (content) => setNote({ ...note, edescription: content });
  const onColorSelect = (colorValue) => setNote({ ...note, ecolor: colorValue });

  const editorRef = React.useRef(null);

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  if (!isOpen) return null;

  return (
    <div className="qn-modal-overlay" onClick={onClose}>
      <div className="qn-modal glass" onClick={e => e.stopPropagation()}>
        <div className="qn-modal-header">
          <h3><FontAwesomeIcon icon={faEdit} /> Update Note</h3>
          <button className="qn-modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSave} className="qn-modal-form">
          <div className="qn-modal-field">
            <label htmlFor="etitle">Title</label>
            <input id="etitle" name="etitle" className="input-dark" value={note.etitle} onChange={onChange} required />
          </div>
          <div className="qn-modal-field">
            <label>Description</label>
            <div className="quill-edit-wrap">
              <ReactQuill
                ref={editorRef}
                theme="snow"
                value={note.edescription}
                onChange={onDescriptionChange}
                modules={quillModules}
                className="qn-quill-editor"
              />
            </div>
          </div>

          <div className="qn-modal-row">
            <div className="qn-modal-field third">
              <label htmlFor="etag">Tag</label>
              <input id="etag" name="etag" className="input-dark" value={note.etag} onChange={onChange} />
            </div>
            <div className="qn-modal-field third">
              <label htmlFor="efolder"><FontAwesomeIcon icon={faFolder} /> Collection</label>
              <select 
                id="efolder" 
                name="efolder" 
                className="input-dark" 
                value={note.efolder} 
                onChange={onChange}
                style={{ appearance: 'auto', padding: '0.65rem' }}
              >
                <option value="">No Collection</option>
                {folders.map(f => (
                  <option key={f._id} value={f._id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="qn-modal-field third">
               <label><FontAwesomeIcon icon={faPalette} /> Color</label>
               <div className="modal-color-options">
                {colors.map(c => (
                  <button
                    key={c.name}
                    type="button"
                    className={`color-dot-sm ${note.ecolor === c.value ? 'active' : ''}`}
                    style={{ background: c.value === 'transparent' ? 'rgba(255,255,255,0.1)' : c.value }}
                    onClick={() => onColorSelect(c.value)}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="qn-modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-glow">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateNoteModal;
