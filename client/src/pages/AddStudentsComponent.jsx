/* UC add student list via CSV */
import './AddStudentsComponent.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddStudents() {
    const navigate = useNavigate();
    
    const [studentList, setStudentList] = useState({
        document: null
    });
    
    const inputChanges = (e) => {
        const { name, files } = e.target;

        setStudentList(prevDetails => ({
            ...prevDetails, 
            [name]: files[0] 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentList.document) {
            alert("Please upload a CSV file.");
            return;
        }

        // to run the program when backend is not done
        console.log("Confirm button clicked");
        console.log("selected file: ", studentList.document)
        alert("Student List uploaded successfully!");
        navigate("/ucdashboard/isad3000/students");
 
        //send CSV file to the backend and store in the database
        const saveData = new FormData();

        saveData.append("document", studentList.document);

        try {
            const response = await fetch(
                "http://localhost:3000/csv/upload/capstone",
                {
                    method: "POST",
                    multipart: { document: { name: 'students.csv', mimeType: 'text/csv', buffer: saveData } }
                }
            );

            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message);
            }
            else {
                console.log("Confirm button clicked");
                alert("Student List uploaded successfully!");
            }
        }
        catch (err) {
            console.error("Unable to upload student list: ", err);
        } 
    };

    return(
        <div>
              <div className="form-container2">
                <div className="round-card">
                    <div className="form-section">
                        <form onSubmit={handleSubmit}>
            
                            <label> Upload Student List    
                            <input
                                type="file"
                                name="document"
                                accept=".csv"
                                onChange={inputChanges}
                                required
                            />
                             </label>

                            <button className="confirm-student-list" type="submit">
                                Confirm
                            </button>
                        </form>
                    </div>
                </div>
              </div>
        </div>
    )

}

export default AddStudents;