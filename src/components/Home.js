import { useEffect, useState } from 'react';
import AddNote from './AddNote';
import Notes from './Notes'
//import bg from '../assets/bg1.png'

const Home = (props) => {
  const { showAlert } = props;
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetch("http://localhost:5000/api/auth/getuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      }).then(response => response.json())
      .then(data => {
        setUser(data);
      })
    }
  }, []);
  return (
    <div className="container my-3">
      <h1 className='container my-3'>Welcome {user ? user.name : "User"} to QuickNote</h1>
      <AddNote showAlert={showAlert} />
      <Notes showAlert={showAlert} />
    </div>
  )
}

export default Home
