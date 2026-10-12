import { useState } from "react";

function EditProject() {
    const [ editExistingProject, setEditExistingProject] = useState(false);
    const [ projectDetails, setProjectDetails ] = useState({
        ID: 1, ////// THIS NEEDS TO BE CHANGED!!! this ID should be the project ID of the chosen project to edit, i.e. when this page loads this ID needs to be set
        Type: [],
        Round: "",
        Name: "",
        Client: "default client", //we need to update this page to have this as a field
        ClientEmail: "default@email", //we need to update to add this field too
        Description: "",
        IntendedSize: ""
    });



async function PostProjectChanges (){
        try 
        {
            console.log("posting changes")
            
            const response = await fetch('http://localhost:3000/UC/api/SaveEditedProject', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                body: JSON.stringify(projectDetails), // Converts JS object to JSON string
            });

            if (response.status == 200)
            {
                alert("Project edited successfully!");
            } else if (response.status == 400)
            {
                alert("invalid project ID, this is rare and may have been caused by a project getting deleted while you were trying to edit it")
            } else if (response.status == 500)
            {
                alert("server failure, most likely the backend server is down")
            }else{
                //getting here is very bad
                alert("unknown outcome occurred")
            }
            const result = await response.json();
            console.log("Server response:", result.message);
        } catch (error) 
        {
            console.error("Error sending data:", error);
            alert("error connecting to backend, backend is likely down")
        }
    }


    const inputChanges = (e) => {
        const { name, value } = e.target;

        setProjectDetails(prevDetails => ({
            ...prevDetails, 
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(editExistingProject);
        PostProjectChanges()
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