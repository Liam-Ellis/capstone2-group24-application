import { useState } from "react";

function EditProject() {
    const [ editExistingProject, setEditExistingProject] = useState(false);
    const [ projectDetails, setProjectDetails ] = useState({
        type: [],
        round: "",
        name: "",
        description: "",
        intendedSize: ""
    });

    const inputChanges = (e) => {
        const { name, value } = e.target;

        setRoundsDetails(prevDetails => ({
            ...prevDetails, 
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(editExistingProject);
        
        alert("Edit project details successfully!");
    };

    return(
        <div className="form-container">
             <div className="form-box">
                <form onSubmit={handleSubmit}>
                    
                    <label> Type </label>
                    <label className="project-type">
                        <input 
                            type="checkbox"
                            name="type"
                            value="WORK project"
                        />
                        <span> WORK </span>
                    </label>

                    <label className="project-type">
                        <input 
                            type="checkbox"
                            name="type"
                            value="Group project"
                        />
                        <span> Group Project </span>
                    </label>

                    <label> Round </label>
                    <input 
                        type="number"
                        name="round"
                        value={editExistingProject.round}
                        required
                        onChange={inputChanges}
                        placeholder="Round"
                    />

                    <label> Project Name </label>
                    <input 
                        type="text"
                        name="name"
                        value={editExistingProject.name}
                        required
                        onChange={inputChanges}
                        placeholder="Name"
                    />

                    <label> Description </label>
                    <textarea 
                        type="text"
                        name="description"
                        value={editExistingProject.description}
                        required
                        onChange={inputChanges}
                        placeholder="Description"
                    />

                    <label> Intended Size </label>
                    <input 
                        type="number"
                        name="intendedSize"
                        value={editExistingProject.intendedSize}
                        required
                        onChange={inputChanges}
                        placeholder="Intended Size"
                    />

                    <button type="submit">
                        Confirm
                    </button>

                </form>
            </div>
        </div>
    )
}

export default EditProject;