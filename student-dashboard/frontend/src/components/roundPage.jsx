import { useState, useEffect } from "react";

/* View Rounds Page */
function RoundPage({ viewProject }) {
    const [rounds, setRounds] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRounds = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/rounds",
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
        <div className="round-page">
            <h2> Application Rounds </h2>

            {rounds.length === 0 ? (
                <p> No application rounds </p>
            ) : (
                rounds.map((round) => (
                    <Round 
                        key={round._id}
                        round={round}
                        onViewProject={viewProject}
                    />
                        
                ))
            )}
        </div>
    );
}

function Round({ round, viewProject }) {
    const [project, setProject] = useState([]);
    const [showProject, setShowProject] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const handleViewProject = async () => {
        setShowProject(true);
        setLoading(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/project/round/${round._id}`,
            );

            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message);
            }
            setProject(data);
            
        }
        catch (err) {
            console.error("Unable to get project: ", err);
        } 
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="round-container">
            <h3> {round.name} </h3>
            <p> Status: <strong>{round.status} </strong></p>

            {round.status === "OPEN" ? (
                <button onClick={handleViewProject}>
                    View Project
                </button>
            ) : (
                <p> This round is closed. </p>
            )}

            {showProject && (
                <div className="project-list">
                    {loading && <p> Loading projects... </p>}
                    {!loading && project.length ===0 && <p> No project available </p>}
                 
                    {project.map((project) => {
                        <div className="project-container"
                        key={project._id}
                        >
                            <h4> {project.title} </h4>
                            <p> {project.description} </p>
                            <button onClick={() => onViewProject(project)}>
                                View Project
                            </button>
                        </div>
                    })}
                </div>
            )}

        </div>
    );
}


export default RoundPage;