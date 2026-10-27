// This screen showcases the Group Allocation Page

import './StudentGroupAllocationPage.css';

import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import './StudentUnitMenu.css';
import notification from '../assets/notification.png'

function Student_GroupAllocation() {
    const [groupNumber, setGroupNumber] = useState(0);
    const [project, setProject] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const navigate = useNavigate();

    const getGroup = async () => {
        try {
            const response = await fetch(
                'http://localhost:3000/student/group',
                {
                    credentials: "include"
                }
            );

            const data = await response.text();
            if(!response.ok) {
                throw new Error(data.message);
            } else {
                const groupData = JSON.parse(data);
                setGroupNumber(groupData.GroupNumber);
                setProject(groupData.Project);
                setGroupMembers(groupData.Students);
            }
        }
        catch (err) {
            console.error("Unable to get group: ", err);
        } 
    };

    getGroup();

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
                <p className="introText">Please find your Group Allocation Details below:</p>
                <div className="allocationGrid">
                    <h3 className="sectionTitle">Your Group Number:</h3>
                    <div className="innerGrid">
                        <p>Group {groupNumber}</p>
                    </div>
                    <h3 className="sectionTitle">Your Group Members:</h3>
                    <div className="innerGrid">
                        {groupMembers.map((member) => (
                        <p>{member}</p>
                        ))}
                    </div>
                    <h3 className="sectionTitle">Your Project:</h3>
                    <div className="innerGrid">
                        {project && (
                            <><p>
                                <strong>Name: </strong>
                                {project.Name}
                            </p><p>
                                    <strong>Description: </strong>
                                    {project.Description}
                                </p><p>
                                    <strong>Client: </strong>
                                    {project.Client}
                                </p><p>
                                    <strong>Contact: </strong>
                                    {project.ClientEmail}
                                </p><p>
                                    <strong>Project Type: </strong>
                                    {project.Type}
                                </p></>
                        )}
                    </div>
                </div>
            </div>
        </div> 
    );
}

export default Student_GroupAllocation;