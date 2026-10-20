import './DownloadApplicationsComponent.css'
import { useState } from "react";

function DownloadApplicationsComponent () {
    const [project, setProject] = useState("");
    const studentsList = {
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

    const inputChanges = (e) => {
        setProject(e.target.value);
    };

    const handleDownloadAll = () => {
        console.log("Downloading...", project);
    };

    const handleDownload = (student) => {
        console.log("Downloading...", student.name);
    };

    return (
        <div className="downloadapplications-container">
            <div>
                <div className="form-container">
                    <div className="form-section">
                    <div className="top-row">
                        <label>
                            Round
                            <select 
                                value={project}
                                onChange={inputChanges}
                            >
                        
                                <option value=""> Select an option </option>
                                <option value="project1"> Round 1 </option>
                                <option value="project2"> Round 2 </option>
                                <option value="project3"> Round 3 </option>
                            </select>
                        </label>

                        <button 
                            className="download-all"
                            onClick={handleDownloadAll}
                            disabled={!project}>
                            Download All
                        </button>
                    </div>
                </div>

            {project && (
                <div className="student-list">
                    {studentsList[project].map((student) => (
                        <div key={student.id} className="student-row">
                            <span>{student.name}</span>
                            <p> Submitted {student.submitted} · {student.fileSize} </p>
                            <button onClick={() => handleDownload(student)}>
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

export default DownloadApplicationsComponent;