import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function ForgotPassword() {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("Student");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const response = await fetch(
      'http://localhost:3000/auth/forgotPassword',
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              email: email,
              type: userType.toLowerCase()
          })
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
      // change to OTP entry page passing email and type parameters
    }
  };

  return (
    <div>
      <main className="main-forgot-content">

        <section className="forgot-title">
          <h1>Forgot Password</h1>
        </section>

        <section className="forgot-form-container">
          <div className="forgot-form-card">
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
                  <label>Account Email
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

              <div className="verify-btn">
                <button
                  type="submit"
                >
                Verify Details
                </button>
              </div>

              {error && (
                <div className="error-msg-div">
                  <p>{error}</p>
                </div>)}
            </form>
          </div>
        </section>
      </main>

    </div>
  );
}

export default ForgotPassword;
