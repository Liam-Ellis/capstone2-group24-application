import "./WORK3008.css";
import logo from "./logo.webp";
import Dropdown from "./Dropdown";
import Projects from "./Projects";
import "./Projects.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddRound from "./AddRound";

function WORK3008() {
  const navigate = useNavigate();

  const sidebar = [
    {
      name: "Institution Page",
      path: "/ucdashboard/institution"
    },
    {
      name: "Units",
      path: "/ucdashboard"
    },
    {
      name: "Settings",
      path: "/ucdashboard/settings"
    }
  ];

  const [rounds, setRounds] = useState([]);
  const [showAddRound, setShowAddRound] = useState(false);
  const [editingRound, setEditingRound] = useState(null);

  const addRound = (newRound) => {
    const roundWithId = {
      ...newRound,
      id: Date.now()
    };

    setRounds((previousRounds) => [
      ...previousRounds,
      roundWithId
    ]);

    setShowAddRound(false);
  };

  const editRound = (updatedRound) => {
    setRounds((previousRounds) =>
      previousRounds.map((round) =>
        round.id === updatedRound.id
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

            <Dropdown
              unitName="WORK3008"
              items={[
                {
                  name: "Announcements",
                  path: "/ucdashboard/work3008/announcements"
                },
                {
                  name: "Round Setup",
                  path: "/ucdashboard/work3008/rounds"
                },
                {
                  name: "Download Applications",
                  path: "/ucdashboard/work3008/applications"
                },
              ]}
            />
          </ul>
        </nav>
      </aside>

      <img
        src={logo}
        alt="Logo"
        className="top-logo"
      />

      <main className="main-content">

        <section className="unit-name">
          <h1>Work Based Project | WORK3008</h1>
          <p></p>
        </section>

        <div className="round-box">

          <div className="round-header">

            <h2>Current available Round</h2>

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
                key={round.id}
              >

                <h3>{round.name}</h3>

                <p>
                  Semester: {round.semester}
                </p>

                <p>
                  Status:{" "}
                  {isRoundExpired(round.endDate)
                    ? "Closed"
                    : round.status}
                </p>

                <p>
                  Duration: From {round.startDate} to{" "}
                  {round.endDate}
                </p>

                <p>
                  Applications: {round.applications} /{" "}
                  {round.maxApplications}
                </p>

                <div className="round-buttons">

                  {!isRoundExpired(round.endDate) &&
                    ["Open", "Draft"].includes(round.status) && (
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

                <Projects />

              </div>
            ))}

          </div>
        </div>

      </main>

    </div>
  );
}

export default WORK3008;