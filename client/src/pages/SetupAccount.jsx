import "./SetupAccount.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function SetupAccount() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [userType, setUserType] = useState("Student");
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const response = await fetch(
      'http://localhost:3000/auth/setup',
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              email: email,
              type: userType.toLowerCase()
          }),
          credentials: "include"
      }
    );

    let responseMsg = await response.text();

    if(!response.ok) {
      if (responseMsg.includes("{") &&
          responseMsg.includes("message")) {
            setError(JSON.parse(responseMsg).message);
      } else {
        setError(responseMsg);
      }
    }
    else {
      setMessage('Your default password has been sent to your email');
    }
  };

  return (
    <div>
      <main className="main-setup-content">

        <section className="title">
          <h1>Create Account</h1>
        </section>

        <section className="setup-form-container">
          <div className="setup-form-card">
              <form onSubmit={handleSubmit}>

                <div className="form-section">
                  <label>
                    Type
                    <select
                      value={userType}
                      onChange={(event) =>
                        setUserType(event.target.value)
                      }
                    >
                      <option>Student</option>
                      <option>Staff</option>
                    </select>
                  </label>

                  <label>
                    Curtin Email
                    <input
                      type="text"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      required
                    />
                  </label>
                </div>

              <button
                type="submit"
                className="setup-btn"
              >
                Create Account
              </button>

              {error && (
                <div className="error-msg-div">
                  <p>{error}</p>
                </div>)}

              {message && (
                <div className="success-msg-div">
                  <div className="success-msg">
                    <p>{message}</p>
                  </div>
                  <div className="success-link">
                    <a href="" onClick={() => {navigate("/login");}}>Login with your account</a>
                  </div>
                </div>)}
            </form>
          </div>
        </section>
      </main>

    </div>
  );
}

export default SetupAccount;
