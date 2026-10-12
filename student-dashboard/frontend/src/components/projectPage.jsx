/* View Project Page */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ProjectPage() {

    const handleApply = () => {
        navigate("/preference"); // go back one step
    };

    const { projectId } = useParams();
    console.log(projectId);

    return (
        <>
            <div className="project-page">

                <button onClick={() => navigate("/round")}>
                    Back to Rounds
                </button>
                
                <h3>Project ID: {projectId} </h3>
                
                <button onClick={handleApply}> Apply </button>
            </div>
        </>
    );
}

export default ProjectPage;