/* Student upload resume or cover letter */
import { useState } from 'react';

function UploadResume({ applicationUploaded }) {
    const [application, setApplication] = useState({
        document: null
    });
    
    const inputChanges = (e) => {
        const { name, files } = e.target;

        setApplication(prevDetails => ({
            ...prevDetails, 
            [name]: files[0] 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!application.document) {
            alert("Please upload a pdf file.");
            return;
        }

        

        try {
            
            const saveData = new FormData();
            saveData.append("document", application.document);
            saveData.append("StudentID", '00000000')


            console.log("now attempting fetch")

            const response = await fetch('http://localhost:3000/UC/api/saveStudentResume', {
                method: 'POST',
                body: saveData
            });
            
            //this was used for testing
            /*
            const response = await fetch('http://localhost:3000/UC/api/getWorkProjectApplications/100', {
                method: 'GET',
            });
            if(!response.ok) {
                throw new Error(data.message);
            } else{
                const data = await response.blob();

                const url = URL.createObjectURL(data);

                const a = document.createElement('a');
                a.href = url;
                a.download = 'project number ' + '100' +' applications.zip'; 
                a.click();
            }
            */
            

            

            
            alert("Resume or cover letter uploaded successfully!");
            
        }
        catch (err) {
            console.error("Unable to upload document: ", err);
            alert("Failed to upload document");
        } 
    };

    return(
        <>
            <h1> Upload Document </h1>
            <div className="form-container">
                <div className="form-box">
                    <form onSubmit={handleSubmit}>
                
                        <label> Upload Resume or Cover Letter </label>    
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
        </>
        
    )

}

export default UploadResume;