// This screen showcases the unit menu items upon selecting a unit

import { useNavigate } from 'react-router-dom';
import './StudentUnitMenu.css';
import notification from '../assets/notification.png'

function Student_ISAD3000() {
    const navigate = useNavigate();
    
    return (
        <div className="dashboard">
            <div className="sidebar">
                <h1 className="dashboard-title">Dashboard</h1>
                <button className="link">Home</button>
                <button className="link">Settings</button>
                <button className="link">Log Out</button>
            </div>
            <div className="content">
                <div className="header">
                    {/* Sample Unit page - needs optimization */}
                    <span className="page-title">Capstone Computing Project 1 | ISAD3000</span>
                    <div className="bell-icon">
                        <img src={notification} alt="Notif logo" className="notiflogoimg"/>
                    </div>
                </div>
                <div className="unitmenu">
                    <button className="menuitem">Announcements</button>
                    <button className="menuitem">Allocated Group</button>
                    <button className="menuitem" onClick={() => navigate("/studentdashboard/apply")}>Application</button>  
                </div>
            </div>
        </div> 
    );
}

export default Student_ISAD3000;