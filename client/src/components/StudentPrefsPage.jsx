import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import notification from '../assets/notification.png'
import PreferencePage from './PreferencePage';

function StudentPrefsPage() {
    const navigate = useNavigate();

    return (
        <div className="dashboard">
            <div className="sidebar">
                <h1 className="dashboard-title">Dashboard</h1>
                <button className="link" onClick={() => navigate("/studentdashboard")}>Home</button>
                <button className="link" onClick={() => navigate("/studentdashboard/prefs")}>Settings</button>
                <button className="link">Log Out</button>
            </div>
            <div className="content">
                <div className="header">
                    {/* Sample Unit page - needs optimization */}
                    <span className="page-title">Student Preferences</span>
                    <div className="bell-icon">
                        <img src={notification} alt="Notif logo" className="notiflogoimg"/>
                    </div>
                </div>
                <PreferencePage />
            </div>
        </div> 
    );
}

export default StudentPrefsPage;