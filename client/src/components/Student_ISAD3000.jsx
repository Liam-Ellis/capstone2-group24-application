// This screen showcases the unit menu items upon selecting a unit

import { useNavigate } from 'react-router-dom';
import './StudentUnitMenu.css';
import './StudentUnitPage.css';
import notification from '../assets/notification.png'

function Student_ISAD3000() {
    const navigate = useNavigate();
    
    return (
        <div className="dashboard">
            <div className="sidebar">
                <h1 className="dashboard-title">Dashboard</h1>
                <button className="link" onClick={() => navigate("/studentdashboard")}>Home</button>
                <button className="link" onClick={() => navigate("/studentdashboard/prefs")}>Settings</button>
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
                    <button className="menuitem" onClick={() => navigate("/studentdashboard/group")}>Allocated Group</button>
                    <button className="menuitem" onClick={() => navigate("/studentdashboard/apply")}>Application</button>
                    <button className="menuitem" onClick={() => navigate("/studentdashboard/resume")}>Upload Resume</button>  
                </div>
            </div>
        </div> 
    );
}

export default Student_ISAD3000;