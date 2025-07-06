import AddNote from './AddNote';
import Notes from './Notes';

const Home = ({ showAlert }) => {

  return (
    <div className="container" style={{ marginTop: '70px' }}>
      <div className="dashboard">
        <div className="dashboard-left">
          <AddNote showAlert={showAlert} />
        </div>
        <div className="dashboard-right">
          <Notes showAlert={showAlert} />
        </div>
      </div>
    </div>
  );
};

export default Home;
