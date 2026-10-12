/* submit application */
import { useState, useEffect } from "react";

function ApplicationRound() {
    const [applicationOpen, setApplicationOpen] = useState(false);
    const [applicationDetails, setApplicationDetails] = useState({
        document: null
    });

    useEffect(() => {
        const applicationRoundStatus = "Open";

        if (applicationRoundStatus === "Open") {
            setApplicationOpen(true);
        }
        else {
            setApplicationOpen(false);
        }
    }, []);

    const inputChanges = (e) => {
        const { name, files } = e.target;

        setApplicationDetails(prevDetails => ({
            ...prevDetails, 
            [name]: files[0] 
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Application submitted successfully!");
    };

    if (!applicationOpen) {
        return (
            <div className="form-container">
                <div className="form-box">
                    <h1>
                        Application Round Closed
                    </h1>
                </div>
            </div>
        );
    }
          
    return(
        <div className="form-container">
            <div className="form-box">
                <form onSubmit={handleSubmit}>
            
                    <label> Upload Document </label>    
                    <input
                        type="file"
                        name="document"
                        accept=".pdf"
                        onChange={inputChanges}
                    />

                    <button type="submit">
                        Submit Application
                    </button>    
                </form>
            </div>
        </div>
    )
}

export default ApplicationRound;