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

    return (
        <>
            <h1> Application Rounds </h1>
            <div className="round-page">
                {rounds.length === 0 ? (
                    <p> No application rounds </p>
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
                `http://localhost:3000/api/project/round/${round._id}`
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

    let displayStatus;

    if (round.status === "CLOSED") {
        displayStatus = "CLOSED";
    }
    else if (round.status === "OPEN") {
        displayStatus = applicationStatus || "NOT_APPLIED";
    }

    return (
        <div className="round-container">
            <h3> {round.name} </h3>
            <p> Status: <strong>{round.status} </strong></p>

            {round.status === "OPEN" ? (
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
                            <h4> {project.title} </h4>
                            <p> {project.description} </p>
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