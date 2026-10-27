/* Student upload resume */
import { useState } from 'react';
import './UploadResume.css' 

function UploadResume() {
    const [resume, setResume] = useState({
        document: null
    });
    
    const inputChanges = (e) => {
        const { name, files } = e.target;

        setResume(prevDetails => ({
            ...prevDetails, 
            [name]: files[0] 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resume.document) {
            alert("Please upload a pdf file.");
            return;
        }

        
        try {
            const saveData = new FormData();
            
            saveData.append("document", resume.document);


            console.log("now attempting fetch")
            const response = await fetch('http://localhost:3000/UC/api/saveStudentResume', {
                method: 'POST',
                body: saveData,
                credentials: 'include'
            });

            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message);
            }

            alert("Resume uploaded successfully!");
            
        }
        catch (err) {
            console.error("Unable to upload document: ", err);
            alert("Failed to upload document");
        }
    };

    return(
        <div className="form-container2">
            <div className="resume-card">
                <div className="form-section" onDrop={inputChanges}>
                    <form onSubmit={handleSubmit}>    
                        <label> Upload Resume   
                        <input
                            type="file"
                            name="document"
                            accept=".pdf"
                            onChange={inputChanges}
                            required
                        />
                        </label>

                        <button className="upload-resume-btn" type="submit">
                            Upload
                        </button>    
                    </form>
                </div>
            </div>
        </div>
    )

}

export default UploadResume;