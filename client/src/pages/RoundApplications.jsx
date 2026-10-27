import { useState } from "react";
import "./Projects.css";

function RoundApplications() {
  const [selectedRound, setSelectedRound] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [roundApplications, setRoundApplications] = useState([]);
  
  const getRoundApplications = () => {

  };

  return (
    <div className="projects-box">
        <div className="projects-container">

          <div className="project-list-section">
            <div className="project-list-header">
              <h3>Rounds</h3>
            </div>

            <div className="project-list">
              {rounds.map((round) => (
                <div
                  key={round.id}
                  className="project-item"
                  onClick={() => setSelectedRound(round)}
                >
                  Round {round.RoundNumber}
                </div>
              ))}
            </div>
          </div>

        <div className="project-details">
            <h3>Applications</h3>

            <div className="application-list">
              {roundApplications.map((app) => (
                <div
                  key={round.id}
                  className="application-item"
                  onClick={() => setSelectedRound(app)}
                >
                  Round {round.RoundNumber}
                </div>
              ))}
            </div>

            {selectedRound ? (
                <>
                    <p>
                        <strong>Description: </strong>
                        {selectedRound.description}
                    </p>

                    <p>
                        <strong>Client: </strong>
                        {selectedRound.client}
                    </p>

                    <p>
                        <strong>Contact: </strong>
                        {selectedRound.clientEmail}
                    </p>

                    <p>
                        <strong>Project Type: </strong>
                        {selectedRound.projectType}
                    </p>

                    <p>
                        <strong>Intended Group Size: </strong>
                        {selectedRound.intendedGroupSize}
                    </p>
                </>
            ) : (
                <p>Select a round to view applications.</p>
            )}

            {roundApplications.length > 0 && (
                <div className="project-buttons">
                    <button
                        className="edit-project-btn"
                        onClick={() => openEditProject(selectedProject)}
                    >
                        Download All
                    </button>
                </div>
            )}
        </div>

        </div>

    </div>
  );
}

export default Projects;