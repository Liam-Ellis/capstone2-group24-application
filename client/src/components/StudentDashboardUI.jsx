// This screen showcases the landing page/main page of the Student Dashboard, adapted from Amelia's original design to be consistent with the UC Dashboard design 

import './StudentDashboardUI.css';
import notification from '../assets/notification.png'

function StudentDashboardUI() {

    return (

        <div className="dashboard">
            <div className="sidebar">
            <h1 className="dashboard-title">Dashboard</h1>
            <button className="link">Home</button>
            <button className="link">My Studies</button>
            <button className="link">Search</button>
            <button className="link">Contact</button>
            <button className="link">Log Out</button>
        </div>
        <div className="content">
            <div className="header">
                <span className="page-title"></span>
                    <div className="bell-icon">
                    <img src={notification} alt="Notif logo" className="notiflogoimg"/>
                </div> 
            </div>                
            <div className="grid">
                <button className="grid-box">Planner</button>
                <button className="grid-box">Units</button>
                <button className="grid-box">Assessments</button>
                <button className="grid-box">Progress</button>
                <button className="grid-box">Discover Events</button>
                <button className="grid-box">Settings</button>
            </div>
            </div>
        </div>

    );
}

export default StudentDashboardUI;

