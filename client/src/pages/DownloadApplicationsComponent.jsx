import './DownloadApplicationsComponent.css'
import { useState } from "react";
import WorkProjects from '../components/WorkProjects'
import backendURL from '../backendURL';

function DownloadApplicationsComponent () {
    const [round, setRound] = useState(-1);
    const [rounds, setRounds] = useState([]);
    const [roundsList, setRoundsList] = useState([]);

    

    //will be a 2 dimenstional array after startup. 
    //first dimension is round, second is project. e.g. roundslist[0][2] would get look at round 1 and get the 3rd project 

    const startUp = async () => {
        //array of work projects
        let workProjects = null 
        //array of rounds.
        let roundss = null
        const projectsResponse = await fetch(backendURL + '/UC/api/requestAllWORKProjects', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                credentials: 'include'
        });

        workProjects = await projectsResponse.json()

        const roundsResponse = await fetch(backendURL + '/UC/api/requestAllRounds', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json', // Tells backend to parse as JSON
                },
                credentials: 'include'
        });

        roundss = await roundsResponse.json()
        setRounds(roundss)

        let roundssList = []

        for (var j = 0; j < rounds.length; j++)
        {
            let row = []

            for (var i = 0; i < workProjects.length; i++)
            {
                try{
                    if ((workProjects[i].Round - 1) === j){
                        row.push(workProjects[i])
                    }
                } catch (err) {
                    console.error("Unable to tie the project \'" + workProjects[i].Name + "\' to a round.", err);
                } 
            }

            roundssList.push(row)
        }

        setRoundsList(roundssList);
    }

    startUp();

    const inputChanges = (e) => {
        if (e.target.value !== null && e.target.value != "") {
            setRound(e.target.value);
        } else {
            setRound(-1);
        }
    };

    return (
        <div className="downloadapplications-container">
            <div className="form-container2">
                <div className="download-card">
                    <div className="form-section">
                        <div className="top-row">
                            <label>
                                Round
                                <select 
                                    value={round}
                                    onChange={inputChanges}
                                >
                            
                                    <option value=""> Select an option </option>

                                    {rounds.map((round) => (
                                        <option
                                        key={round.RoundNumber}
                                        value={round.RoundNumber}
                                        >
                                        Round {round.RoundNumber}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>

                    {round > -1 && (
                        <WorkProjects roundNum={round} roundsList={roundsList} />)}
                </div>
            </div>
        </div>
    )
}

export default DownloadApplicationsComponent;