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

        // send pdf file to the backend and store in the database
        const saveData = new FormData();
        saveData.append("document", resume.document);

        /*
        try {
const saveData = new FormData();
            saveData.append("document", application.document);
            //TODO: this needs to be replaced by student's ID
            saveData.append("StudentID", '00000000')

            const response = await fetch('http://localhost:3000/UC/api/saveStudentResume', {
                method: 'POST',
                body: saveData
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
        }*/
    };

    return(
            <div className="resume-form-box">
                <div className="form-box">
                    <form onSubmit={handleSubmit}>                
                        <input
                            type="file"
                            name="document"
                            accept=".pdf"
                            onChange={inputChanges}
                            required
                        />

                        <button type="submit">
                            Submit
                        </button>    
                    </form>
                </div>
            </div>
    )

}

export default UploadResume;