// This screen presents the Units a student is enrolled into

import './StudentUnitPage.css';
import notification from '../assets/notification.png'

function StudentUnitPage() {

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
                <span className="page-title">Units</span>
                    <div className="bell-icon">
                    <img src={notification} alt="Notif logo" className="notiflogoimg"/>
                </div> 
            </div>
            <div className="grid">
                <button className="grid-box">Capstone Computing Project 1 | ISAD3000 (Semester 1, 2026, Bentley)</button>
                <button className="grid-box">Human Computer Interface | ICTE3002 (Semester 1, 2026, Bentley)</button>
                <button className="grid-box">Work Based Project | WORK3008 (Semester 1, 2026, Bentley) </button>
            </div>
            </div>
        </div>

    );
}

export default StudentUnitPage;