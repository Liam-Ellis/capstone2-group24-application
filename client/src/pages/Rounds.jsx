import "./Rounds.css";
import Projects from "./Projects";
import "./Projects.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddRound from "./AddRound";

function Rounds() {
  const navigate = useNavigate();

  const sidebar = [

    {
      name: "Units",
      path: "/ucdashboard"
    },
    {
      name: "Rounds",
      path: "/ucdashboard/rounds"
    },
    {
      name: "Group Allocation",
      path: "/ucdashboard/groups"
    },
    {
      name: "Download Applications",
      path: "/ucdashboard/rounds/applications"
    },
  ];

  const [rounds, setRounds] = useState([]);
  const [showAddRound, setShowAddRound] = useState(false);
  const [editingRound, setEditingRound] = useState(null);

  const fetchRounds = async () => {
    try {
        const response = await fetch(
            "http://localhost:3000/UC/api/requestAllRounds",
            {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
            }
        );

        const data = await response.json();
        if(!response.ok) {
            throw new Error(data.message);
        }
        
        setRounds(data);
    }
    catch (err) {
        console.error("Unable to get rounds: ", err);
    }
  };

  fetchRounds();

  const addRound = (newRound) => {
    setRounds((previousRounds) => [
      ...previousRounds,
      newRound
    ]);

    setShowAddRound(false);
  };

  const editRound = (updatedRound) => {
    setRounds((previousRounds) =>
      previousRounds.map((round) =>
        round.RoundNumber === updatedRound.RoundNumber
          ? updatedRound
          : round
      )
    );

    setEditingRound(null);
    setShowAddRound(false);
  };

  const openEditRound = (round) => {
    setEditingRound(round);
    setShowAddRound(true);
  };

  const closeRound = (index) => {
    setRounds((previousRounds) =>
      previousRounds.map((round, roundIndex) =>
        roundIndex === index
          ? { ...round, status: "Closed" }
          : round
      )
    );
  };

  const isRoundExpired = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);

    return today > end;
  };

  const dateOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  const dateFormatter = new Intl.DateTimeFormat('en-AU', dateOptions);

  return (
    <div className="work3008-container">

      <aside className="sidebar">
        <h2>UC Dashboard</h2>

        <nav>
          <ul>
            {sidebar.map((item) => (
              <li
                key={item.name}
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </li>
            ))}

          </ul>
        </nav>
      </aside>



      <main className="main-content">

        <section className="unit-name">
          <h1>Rounds Setup</h1>
          <p></p>
        </section>

        <div className="round-box">

          <div className="round-header">

            <h2>Rounds</h2>

            <button
              className="add-round-btn"
              onClick={() => {
                setEditingRound(null);
                setShowAddRound(true);
              }}
            >
              + Add Round
            </button>

            {showAddRound && (
              <AddRound
                existingRound={editingRound}
                onAddRound={addRound}
                onEditRound={editRound}
                onCancel={() => {
                  setEditingRound(null);
                  setShowAddRound(false);
                }}
              />
            )}

          </div>

          <div className="round-content">

            {rounds.map((round, index) => (
              <div
                className="round-card"
                key={round.RoundNumber}
              >

                <h3>Round {round.RoundNumber}</h3>

                <p>
                  Status:{" "}
                  {isRoundExpired(round.endDate)
                    ? "Closed"
                    : "Open"}
                </p>

                <p>
                  Duration: {dateFormatter.format(new Date(round.StartDate))} —{" "}
                  {dateFormatter.format(new Date(round.EndDate))}
                </p>

                <div className="round-buttons">

                  {!isRoundExpired(round.endDate) && (
                      <div className="round-buttons">

                        <button
                          className="close-round-btn"
                          onClick={() => closeRound(index)}
                        >
                          Close Round
                        </button>

                        <button
                          className="edit-round-btn"
                          onClick={() => openEditRound(round)}
                        >
                          Edit Round
                        </button>

                      </div>
                  )}

                </div>
                

                {!isRoundExpired(round.EndDate) && (
                <Projects round={round.RoundNumber} />)}

              </div>
            ))}

          </div>
        </div>

      </main>

    </div>
  );
}

export default Rounds;