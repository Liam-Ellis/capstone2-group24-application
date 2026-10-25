import './DownloadApplications.css'
import { useState } from "react";

function DownloadApplications () {
    const [project, setProject] = useState("");
    
    //will be a 2 dimenstional array after startup. 
    //first dimension is round, second is project. e.g. roundslist[0][2] would get look at round 1 and get the 3rd project 
    let roundsList = null

    const startUp = async () => {
        //array of work projects
        let workProjects = null 
        //array of rounds.
        let rounds = null
        const projectsResponse = await fetch('http://localhost:3000/UC/api/requestAllWORKProjects', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                }
        });

        workProjects = await projectsResponse.json()

        const roundsResponse = await fetch('http://localhost:3000/UC/api/requestAllRounds', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                }
        });

        rounds = await roundsResponse.json()
        roundsList = []
        for (var i = 0; i < rounds.length; i++)
        {
            roundsList.push([])
        }

        for (var i = 0; i < workProjects.length; i++)
        {
            try{
                //add this work project to the appropriate part of the array. note that roundsList[0] is Round number 1
                roundsList[workProjects[i].Round-1].push(workProjects[i])
            } catch (err) {
                console.error("Unable to tie the project \'" + workProjects[i].Name + "\' to a round.", err);
            } 
        }
    }
    startUp();

    /*
    const projectsList = {
        project1: [
            {
                id: 1,
                name: "Kai Bennette",
                submitted: "2026-02-01",
                fileSize: "1.2MB"
            },
            {
                id: 2,
                name: "Maya Thompson",
                submitted: "2026-01-29",
                fileSize: "0.9MB"
            }
        ],
        project2: [
            {
                id: 1,
                name: "Theo Morgon",
                submitted: "2026-02-01",
                fileSize: "1.2MB"
            },
            {
                id: 2,
                name: "Aria Collins",
                submitted: "2026-02-02",
                fileSize: "1.1MB"
            }
        ],
        project3: [
            {
                id: 1,
                name: "Sienna Brooke",
                submitted: "2026-02-02",
                fileSize: "1.0MB"
            },
            {
                id: 2,
                name: "Luna Parker",
                submitted: "2026-01-28",
                fileSize: "0.9MB"
            }
        ]
    };
    */

    const inputChanges = (e) => {
        setProject(e.target.value);
    };

    const handleDownloadAll = () => {
        console.log("Downloading...", project);
    };

    const handleDownload = (project) => {
        console.log("Downloading...", project.Name);
    };

    return (
        <div className="downloadapplications-container">
            <h1> 
                Download Applications
            </h1>

            <div>
                <div className="form-container">
                    <div className="top-row">
                        <select 
                            value={project}
                            onChange={inputChanges}
                        >
                    
                            <option value=""> Select an option </option>
                            <option value="project1"> Round 1 </option>
                            <option value="project2"> Round 2 </option>
                            <option value="project3"> Round 3 </option>
                        </select>

                    <button 
                        className="download-all"
                        onClick={handleDownloadAll}
                        disabled={!project}>
                        Download All
                    </button>
                </div>

            {project && (
                <div className="student-list">
                    {roundsList[project].map((project) => (
                        <div key={project.ID} className="student-row">
                            <span>{project.Name}</span>
                            <p> Client {project.Client}</p>
                            <button onClick={() => handleDownload(project)}>
                                Download
                            </button>
                        </div>
                    ))
                    }
                </div>

            )}
        </div>
            </div>
        </div>
    )
}

export default DownloadApplications;