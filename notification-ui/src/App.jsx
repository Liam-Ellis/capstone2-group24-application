import './App.css';
import EmailNotification from "./components/emailNotification";
import ReminderNotification from "./components/reminderNotification";
import SideBar from './components/sidebar';
import Curtin_University from "./assets/Curtin_University.png";
                               
function App() {
  return (
    <div className="app-container">
      <h1> 
        Communication and Notification 
      </h1>
      <div style={styles.mainGrid}>
        <div style={styles.left}>
          <SideBar></SideBar>
        </div>
        
        <div style={styles.right}>
          <div className="notification">
            <EmailNotification></EmailNotification>
            <ReminderNotification></ReminderNotification>
        
          </div>
          </div>
      </div>
    </div>
  );
}

const styles = {
  mainGrid: {
    display: "grid",
    gridTemplateColumns: '25% 70%',
    gap: '50px',
    padding: '20px',
  },

  left: {
    textAlign: "left",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "20px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
    
  },

  right: {
    textAlign: "left",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "20px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
  },
};

export default App;
