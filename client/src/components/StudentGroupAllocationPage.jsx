// This screen showcases the Group Allocation Page

import './StudentGroupAllocationPage.css';

import { useNavigate } from 'react-router-dom';
import './StudentUnitMenu.css';
import notification from '../assets/notification.png'

function Student_GroupAllocation() {
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
                <p className="introText">Please find your Group Allocation Details below:</p>
                <div className="allocationGrid">
                    <h3 className="sectionTitle">Your Group Number:</h3>
                    <div className="innerGrid">
                        <p>Group [Number]</p>
                    </div>
                    <h3 className="sectionTitle">Your Group Members:</h3>
                    <div className="innerGrid">
                        <p>[Group Member]</p>
                        <p>[Group Member]</p>
                        <p>[Group Member]</p>
                        <p>[Group Member]</p>
                        <p>[Group Member]</p>
                        <p>[Group Member]</p>
                    </div>
                    <h3 className="sectionTitle">Your Project:</h3>
                    <div className="innerGrid">
                        <p>[Project]</p>
                    </div>
                </div>
            </div>
        </div> 
    );
}

export default Student_ISAD3000;