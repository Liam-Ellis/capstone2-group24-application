import { useEffect, useState } from "react";
import "./AddRound.css";

function AddRound({
  onAddRound,
  onEditRound,
  onCancel,
  existingRound
}) {
  const [roundName, setRoundName] = useState("");
  const [semester, setSemester] = useState("Semester 1, 2026");
  const [status, setStatus] = useState("Draft");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxApplications, setMaxApplications] = useState("");

  useEffect(() => {
    if (existingRound) {
      setRoundName(existingRound.name || "");
      setSemester(existingRound.semester || "Semester 1, 2026");
      setStatus(existingRound.status || "Draft");
      setStartDate(existingRound.startDate || "");
      setEndDate(existingRound.endDate || "");
      setMaxApplications(existingRound.maxApplications || "");
    } else {
      setRoundName("");
      setSemester("Semester 1, 2026");
      setStatus("Draft");
      setStartDate("");
      setEndDate("");
      setMaxApplications("");
    }
  }, [existingRound]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const roundData = {
      ...existingRound,
      name: roundName,
      semester: semester,
      status: status,
      startDate: startDate,
      endDate: endDate,
      maxApplications: maxApplications
    };

    if (existingRound) {
      onEditRound(roundData);
    } else {
      onAddRound({
        ...roundData,
        applications: 0
      });
    }
  };

  return (
    <div className="add-round-overlay">
      <div className="add-round-form">

        <div className="add-round-header">
          <h2>
            {existingRound ? "Edit Round" : "Add New Round"}
          </h2>

          <button
            type="button"
            className="close-btn"
            onClick={onCancel}
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-section">
            <h3>Round Details</h3>

            <label>
              Round Name
              <input
                type="text"
                placeholder="Round 1"
                value={roundName}
                onChange={(event) =>
                  setRoundName(event.target.value)
                }
                required
              />
            </label>

            <label>
              Semester
              <select
                value={semester}
                onChange={(event) =>
                  setSemester(event.target.value)
                }
              >
                <option>Semester 1, 2026</option>
                <option>Semester 2, 2026</option>
              </select>
            </label>

            <label>
              Status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
                <option>Draft</option>
                <option>Open</option>
              </select>
            </label>
          </div>

          <div className="form-section">
            <h3>Application Period</h3>

            <div className="date-container">

              <label>
                Start Date
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(event.target.value)
                  }
                  required
                />
              </label>

              <label>
                End Date
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) =>
                    setEndDate(event.target.value)
                  }
                  required
                />
              </label>

            </div>
          </div>

          <div className="form-section">
            <h3>Application Settings</h3>

            <label>
              Maximum Applications
              <input
                type="number"
                min="1"
                placeholder="50"
                value={maxApplications}
                onChange={(event) =>
                  setMaxApplications(event.target.value)
                }
                required
              />
            </label>
          </div>

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-round-btn"
            >
              {existingRound ? "Save Changes" : "Add Round"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AddRound;