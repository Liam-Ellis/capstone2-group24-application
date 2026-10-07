/* View Project Page */

function ProjectPage({ project, onApply, onBack }) {
    return (
        <div className="project-page">

            <button onClick={onBack}> Back to Rounds </button>
            
            <h1>Project Page</h1>
            
            <h4> Project name: {project.title} </h4>

            <strong> Project Description </strong>
            <p> {project.description} </p>

            <button onClick={onApply}> Apply </button>
        </div>
    );
}

export default ProjectPage;