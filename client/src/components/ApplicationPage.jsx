import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApplicationPage.css';
import ApplicationProjects from './ApplicationProjects';

import notification from '../assets/notification.png'

function ApplicationPage() {
    const navigate = useNavigate();

    const [rounds, setRounds] = useState([]);
        const [error, setError] = useState("");
    
        useEffect(() => {
            const fetchRounds = async () => {
                try {
                    const response = await fetch(
                        "http://localhost:3000/api/round"
                    );
    
                    const data = await response.json();
                    if(!response.ok) {
                        throw new Error(data.message);
                    }
                    
                    setRounds(data);
                }
                catch (err) {
                    console.error("Unable to get rounds: ", err);
                    setError("Unable to load rounds");
                } 
            
            };
    
            fetchRounds();
        },[]);
    
        if (error) {
            return <p>{error}</p>
        }
    
        const anyOpenRound = (rounds) => {
            if (rounds.length === 0) {
                return false;
            }
    
            let currentDate = new Date().getTime();
    
            rounds.forEach(round => {
                let roundStartDate = new Date(round.StartDate).getTime();
                let roundEndDate = new Date(round.EndDate).getTime();
        
                if (!(currentDate >= roundStartDate &&
                    currentDate < roundEndDate)) {
                    return false;
                }
            });
    
            return true;
        };
    
    const anyOpenRounds = anyOpenRound(rounds);

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
                    <span className="page-title">Application Rounds</span>
                    <div className="bell-icon">
                        <img src={notification} alt="Notif logo" className="notiflogoimg"/>
                    </div>
                </div>
                <div className="round-page">
                    <div className="round-box">
                        {!anyOpenRounds ? (
                            <p> No open application rounds </p>
                        ) : (
                            rounds.map((round) => (
                                <Round 
                                    key={round._id}
                                    round={round}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div> 
    );
}


function Round({ round }) {
    const [showProjects, setShowProjects] = useState(false);
    
    const viewProjects = () => {
        if (showProjects) {
            setShowProjects(false);
        } else {
            setShowProjects(true);
        }
    };

    let displayStatus = "CLOSED";
    let roundStartDate = new Date(round.StartDate).getTime();
    let roundEndDate = new Date(round.EndDate).getTime();
    let currentDate = new Date().getTime();
    
    if (currentDate >= roundStartDate &&
        currentDate < roundEndDate) {
        displayStatus = "OPEN";
    }

    return (
       <div className="round-content">
              <div
                className="round-card"
              >

                <h3>Round {round.RoundNumber}</h3>

                <p>
                  Status: {displayStatus}
                </p>


                <div className="round-buttons">
                  {displayStatus === "OPEN" && (
                      <div className="round-buttons">

                        <button
                          className="view-projects-btn"
                          onClick={() => viewProjects()}
                        >
                          {showProjects ? "Hide Projects" : "View Projects"}
                        </button>

                      </div>
                  )}

                </div>
                

                {showProjects && (
                <ApplicationProjects round={round.RoundNumber} />)}

              </div>
          </div>
    );
}

export default ApplicationPage;