import { useEffect, useState } from "react";
import "./AddRound.css";

function AddRound({
  onAddRound,
  onEditRound,
  onCancel,
  existingRound
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingRound) {
      setStartDate(existingRound.StartDate || "");
      setEndDate(existingRound.EndDate || "");
    } else {
      setStartDate("");
      setEndDate("");
    }
  }, [existingRound]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const roundData = {
      ...existingRound,
      StartDate: startDate,
      EndDate: endDate,
    };

    if (existingRound) {
      try {
        const response = await fetch(
            "http://localhost:3000/UC/api/EditRound",
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(roundData),
            }
        );

        const data = await response.text();
        if(!response.ok) {
          if (data.includes("{") && data.includes("message")) {
            setError(JSON.parse(data).message);
          } else {
            setError(data);
          }
        } else {
          onEditRound(JSON.parse(data));
        }
      }
      catch (err) {
        setError(err);
      }
    } else {
      try {
        const response = await fetch(
            "http://localhost:3000/UC/api/SaveNewRound",
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(roundData),
            }
        );

        const data = await response.text();
        if(!response.ok) {
          if (data.includes("{") && data.includes("message")) {
            setError(JSON.parse(data).message);
          } else {
            setError(data);
          }
        } else {
          onAddRound(JSON.parse(data));
        }
      }
      catch (err) {
          setError(err);
      }
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

          {error && (
            <div className="error-msg-div">
              <p>{error}</p>
            </div>)}
        </form>

      </div>
    </div>
  );
}

export default AddRound;