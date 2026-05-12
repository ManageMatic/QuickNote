import AddNote from '../notes/AddNote';
import Notes from '../notes/Notes';
import '../styles/Home.css';

const Home = ({ showAlert }) => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <AddNote showAlert={showAlert} />
        </aside>
        <main className="dashboard-main">
          <Notes showAlert={showAlert} />
        </main>
      </div>
    </div>
  );
};

export default Home;
