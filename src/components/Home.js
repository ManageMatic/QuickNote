import React, { useContext } from 'react'
//import bg from '../assets/bg1.png'
import NoteContext from '../context/notes/NoteContext'

const Home = () => {
  const context = useContext(NoteContext);
  const { notes, setNotes } = context;
  return (
    <div className="container my-3">
      <h1>Add a Note!</h1>
      <form>
        <div className="mb-3">
          <label for="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="title"/>
        </div>
        <div className="mb-3">
          <label for="desc" className="form-label">Description</label>
          <textarea type="text" className="form-control" id="desc"/>
        </div>
        <div className="mb-3">
          <label for="tag" className="form-label">Tag</label>
          <input type="text" className="form-control" id="tag"/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      <hr />
      <div className="my-3">
        <h2>Your Notes!</h2>
        {notes.length === 0 && 'No notes to display'}
        {notes.map((note) => {
          return (
            <div key={note._id} className="card my-2">
              <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <p className="card-text">{note.description}</p>
                <p className="card-text"><small className="text-muted">Tag: {note.tag}</small></p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Home
