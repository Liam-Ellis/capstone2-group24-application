/* Create New Round */
import { useState } from "react";

function Rounds() {
    const [createRounds, setCreatedRounds] = useState("");
    const [roundsDetails, setRoundsDetails] = useState({
        title: "",
        round: "",
        startDate: "",
        endDate: "",
        eligibleStudents: "",
        description: "",
        resume: null,
        coverLetter: null
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

        console.log(roundsDetails);
        
        alert("Created Successfully!");
    };

    return(
        <div className="form-container">
            <div className="form-box">
                <form onSubmit={handleSubmit}>
                    
                    <label> Title </label>
                    <input 
                        type="text"
                        name="title"
                        value={roundsDetails.title}
                        required
                        onChange={inputChanges}
                        placeholder="Title"
                    />

                    <label> Round </label>
                    <input 
                        type="number"
                        name="round"
                        value={roundsDetails.round}
                        required
                        onChange={inputChanges}
                        placeholder="Round"
                    />

                    <label> Start Date </label>
                    <input 
                        type="date"
                        name="startDate"
                        value={roundsDetails.startDate}
                        required
                        onChange={inputChanges}
                        placeholder="Start Date"
                    />

                    <label> End Date </label>
                    <input 
                        type="date"
                        name="endDate"
                        value={roundsDetails.endDate}
                        required
                        onChange={inputChanges}
                        placeholder="End Date"
                    />

                    <label> Eligible Students </label>
                    <input 
                        type="text"
                        name="eligibleStudents"
                        value={roundsDetails.eligibleStudents}
                        required
                        onChange={inputChanges}
                        placeholder="Eligible Students"
                    />

                    <label> Description </label>
                    <textarea 
                        type="text"
                        name="description"
                        value={roundsDetails.description}
                        required
                        onChange={inputChanges}
                        placeholder="Description"
                    />

                    <label> Resume </label>    
                    <input
                        type="file"
                        name="resume"
                        accept=".pdf"
                        required
                        onChange={inputChanges}
                    />

                    <label> Cover Letter </label>    
                    <input
                        type="file"
                        name="coverLetter"
                        accept=".pdf"
                        onChange={inputChanges}
                    />

                    <button type="submit">
                        Create
                    </button>

                </form>
            </div>
        </div>
    )
}

export default Rounds;