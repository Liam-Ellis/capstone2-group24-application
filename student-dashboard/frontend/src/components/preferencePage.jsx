import { useState } from "react";

function PreferencePage() {
    const [studentDetails, setStudentDetails] = useState({
        studentId: "",
        fullName: "",
        CWA: "",
        pref1: "",
        pref2: "",
        pref3: "",
        pref4: "",
        pref5: "",
        dislikePref1: "",
        dislikePref2: "",
        dislikePref3: "",
        dislikePref4: "",
        dislikePref5: ""
    });

    const inputChanges = (e) => {
        const { name, value } = e.target;

        setStudentDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:3000/api/preferences",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(studentDetails)
                }
            );

            const data = await response.json();
            if(!response.ok) {
                alert(data.message);
            }
            else {
                console.log("Submit button clicked");
                alert("Preferences submitted successfully!");
            }
        }
        catch (err) {
            console.error("Unable to upload document: ", err);
            alert("Failed to submit!");
        }
    };

    return (
        <div className="pref-page">
            <div className="pref-container" onSubmit={handleSubmit}>
                <label> Student ID </label>
                <input 
                    type="number"
                    name="studentId"
                    value={studentDetails.studentId}
                    onChange={inputChanges}
                    placeholder="Student ID"
                />

                <label> Full Name </label>
                <input 
                    type="text"
                    name="fullName"
                    value={studentDetails.fullName}
                    onChange={inputChanges}
                    placeholder="Full Name"
                />

                <label> Course Weighted Average (CWA) </label>
                <input 
                    type="number"
                    name="CWA"
                    value={studentDetails.CWA}
                    onChange={inputChanges}
                    placeholder="Course Weighted Average"
                />

                <div className="radio-container">
                    <label> Email Notifications </label>
                    <label className="radio-opt">
                        <input
                            type="radio"
                            name="emailNotifications"
                            value="Yes"
                            onChange={inputChanges}
                        />
                        Yes, send me emails
                    </label>

                    <label className="radio-opt">
                        <input
                            type="radio"
                            name="emailNotifications"
                            value="No"
                            onChange={inputChanges}
                        />
                        No, opt out of emails
                    </label>

                    <label> Select your course / major </label>
                    {["opt1", "opt2", "opt3", "opt4", "opt5"].map((opt, i) => {
                        const labels = [
                            "Bachelor of Computing (Computer Science)",
                            "Bachelor of Computing (Cyber Security)",
                            "Bachelor of Computing (Software Engineering)",
                            "Bachelor of Information Technology",
                            "Other"
                        ];
                        return (
                            <label className="radio-opt" key={opt}>
                                <input 
                                    type="radio"
                                    name="major"
                                    value="{opt}"
                                    onChange={inputChanges}
                                />
                                {labels[i]}
                            </label>
                        );
                    })}
                </div>

                {[1, 2, 3, 4, 5].map((n) => (
                    <div key={`pref${n}`}>
                        <label>
                            {n}{n === 1 ? "st " : n === 2 ? "nd " : n === 3 ? "rd " : "th "} 
                            Preference - Name of student you would like to be in a group with
                        </label>

                        <input
                            type="text"
                            name={`pref${n}`}
                            value={studentDetails[`pref${n}`]}
                            onChange={inputChanges}
                            placeholder={`${n}${n === 1  ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"} Preferences`}
                        />
                    </div>
                ))}

                {[1, 2, 3, 4, 5].map((n) => (
                    <div key={`dislikePref${n}`}>
                        <label>
                            {n}{n === 1 ? "st " : n === 2 ? "nd" : n === 3 ? "rd" : "th"} 
                            Preference - Name of student you would NOT like to be in a group with
                        </label>

                        <input
                            type="text"
                            name={`dislikePref${n}`}
                            value={studentDetails[`dislikePref${n}`]}
                            onChange={inputChanges}
                            placeholder={`${n}${n === 1  ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"} Preferences`}
                        />
                    </div>
                ))}
                
                <button type="submit">
                    Submit
                </button>

            </div>
        </div>
    )
}

export default PreferencePage;