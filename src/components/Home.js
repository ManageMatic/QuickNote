import { useEffect, useState } from 'react';
import AddNote from './AddNote';
import Notes from './Notes';

const host = 'http://localhost:5000';

const Home = ({ showAlert }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      /* 1️⃣  get user with current access token */
      let res = await fetch(`${host}/api/auth/getuser`, {
        method: 'POST',
        credentials: 'include',          //  ✅ send cookies
      });

      /* 2️⃣  if access token expired → try refresh once */
      if (res.status === 401 || res.status === 403) {
        const ref = await fetch(`${host}/api/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include',
        });

        if (ref.ok) {
          res = await fetch(`${host}/api/auth/getuser`, {
            method: 'POST',
            credentials: 'include',
          });
        }
      }

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="container" style={{ marginTop: '70px' }}>
      <h1 className="container my-3">
        Welcome {user ? user.name : 'User'} to QuickNote
      </h1>
      <AddNote showAlert={showAlert} />
      <Notes showAlert={showAlert} />
    </div>
  );
};

export default Home;
