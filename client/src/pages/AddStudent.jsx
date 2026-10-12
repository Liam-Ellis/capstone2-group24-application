/* add individual student to the student list */
import './AddStudent.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddStudent() {
    const navigate = useNavigate();

    const [studentDetails, setStudentDetails] = useState({
        studentId: "",
        lastName: "",
        firstName: "",
        email: "",
        course: "",
        unit: "",
    });

    async function PostStudent (){
        try 
        {
            const response = await fetch('http://localhost:50000/api/POST_student', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                body: JSON.stringify(studentDetails), // Converts JS object to JSON string
            });

            if (response.status == 200)
            {
                alert("Student added to the list successfully!");
                navigate("/ucdashboard/isad3000/students");
            } else if (response.status == 400)
            {
                alert("invalid student given, please make sure the student is valid before submitting")
            } else if (response.status == 401)
            {
                alert("that student already exists in the database")
            } else{
                //getting here is very bad
                console.log(response);
                alert("unknown outcome occurred")
            }

            const result = await response.json();
            console.log("Server response:", result.message);

            
        } catch (error) 
        {
            console.error("Error sending data:", error);
        }
    }








    const inputChanges = (e) => {
        const { name, value } = e.target;
        
        setStudentDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        })); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(studentDetails);
        PostStudent();
    };

    return(
        <div className="addstudent-container">
            <h1> 
                Add Individual student to the student list
            </h1>

            <div>
                <div className="form-container">
                    <div className="form-box">
                        <form onSubmit={handleSubmit}>
                            <label> Student ID </label>
                            <input 
                                type="text"
                                name="studentId"
                                value={studentDetails.studentId}
                                required
                                inputMode="numeric"
                                pattern="[0-9]+"
                                onChange={inputChanges}
                                placeholder="Student ID"
                            />

                            <label> Last Name </label>
                            <input 
                                type="text"
                                name="lastName"
                                value={studentDetails.lastName}
                                required
                                onChange={inputChanges}
                                placeholder="Last Name"
                            />

                            <label> First Name </label>
                            <input 
                                type="text"
                                name="firstName"
                                value={studentDetails.firstName}
                                required
                                onChange={inputChanges}
                                placeholder="First Name"
                            />

                            <label> Email </label>
                            <input 
                                type="text"
                                name="email"
                                value={studentDetails.email}
                                required
                                onChange={inputChanges}
                                placeholder="Email"
                            />

                            <select
                                name="course"
                                value={studentDetails.course}
                                required
                                onChange={inputChanges}
                            >
                                <option value="">
                                    Select course 
                                </option>

                                <option value="1">
                                    Bachelor of Computing - Software Engineering
                                </option>

                                <option value="2">
                                    Bachelor of Computing - Computer Science
                                </option>

                                <option value="3">
                                    Bachelor of Computing - Cyber Security
                                </option>

                                <option value="4">
                                    Bachelor of Information Technology
                                </option>

                            </select>

                            <label> Select enrolled unit </label>

                            <label className="enrol-option"> 
                                <input
                                    type="radio"
                                    name="unit"
                                    value="ISAD3000"
                                    onChange={inputChanges}
                                    required
                                />
                                <span> ISAD3000 Capstone Computing Project 1 </span>
                            </label>

                            <label className="enrol-option"> 
                                <input 
                                    type="radio"
                                    name="unit"
                                    value="ISAD3001"
                                    onChange={inputChanges}
                                    required
                                />
                                <span> ISAD3001 Capstone Computing Project 2 </span>
                            </label>

                            <label className="enrol-option"> 
                                <input 
                                    type="radio"
                                    name="unit"
                                    value="ICTE3002"
                                    onChange={inputChanges}
                                    required
                                />
                                <span> ICTE3002 Human Computer Interface </span>
                            </label>
                            
                            <button type="submit">
                                Add student to the list
                            </button>
                        </form>
                    </div>
                </div>
            </div> 
        </div> 
    )
}

export default AddStudent;