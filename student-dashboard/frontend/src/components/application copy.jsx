/* View Application Status */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RoundPage() {
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

        rounds.forEach(round => {
            if (round.status !== "OPEN") {
                return false;
            }
        });

        return true;
    };

    const anyOpenRounds = anyOpenRound(rounds);

    return (
        <>
            <h1> Application Rounds </h1>
            <div className="round-page">
                {!anyOpenRounds ? (
                    <p> No open application rounds </p>
                ) : (
                    rounds.slice(0,3).map((round) => (
                        <Round 
                            key={round._id}
                            round={round}
                        />
                    ))
                )}
            </div>
        </>
    );
}

function Round({ round }) {
    const [projects, setProjects] = useState([]);
    const [showProject, setShowProject] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleViewProjects = async () => {
        setShowProject(true);
        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/project/round/${round.RoundNumber}`
            );

            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message);
            }
            setProjects(data);
            
        }
        catch (err) {
            console.error("Unable to get project: ", err);
        } 
        finally {
            setLoading(false);
        }
    };

    const handleViewProject = (project) => {
        navigate(`/project/${project._id}`);
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
        <div className="round-container">
            <h3> Round {round.RoundNumber} </h3>
            <p> Status: <strong>{displayStatus} </strong></p>

            {displayStatus === "OPEN" ? (
                <button onClick={handleViewProjects}>
                    View Project
                </button>
            ) : (
                <p> This round is closed. </p>
            )}

            {showProject && (
                <div className="project-list">
                    {loading && <p> Loading projects... </p>}
                    {!loading && projects.length === 0 && <p> No project available </p>}
                 
                    {projects.map((project) => (
                        <div className="project-container"
                        key={project._id}
                        >
                            <h4> {project.Name} </h4>
                            <p> {project.Description} </p>
                            <button onClick={() => handleViewProject(project)}>
                                View Project
                            </button>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

function Application() {
    return (
        <>
            <RoundPage />
        </>
    );
}

export default Application;