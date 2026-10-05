import "./ResetPassword.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function ResetPassword({userType}) {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const response = await fetch(
      'http://localhost:3000/auth/resetPassword',
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              password: password,
              reconfirmPassword: confirmedPassword
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
      setMessage('Your password has been successfully reset');
    }
  };

  const login = () => {
    switch (userType) {
      case 'student':
        navigate('/studentdashboard');
        break;
      case 'staff':
        navigate('/ucdashboard');
        break;
    }
  };

  return (
      <main className="main-setup-content">

        <section className="reset-title">
          <h1>Reset Password</h1>
        </section>

        <section className="reset-form-container">
          <div className="reset-form-card">
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <div className="reset-label">
                    <p>Create a strong password to secure your account</p>
                  </div>
                  <label>
                    New Pasword
                    <input
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      required
                    />
                  </label>
                  <label>
                    Re-Enter New Pasword
                    <input
                      type="password"
                      value={confirmedPassword}
                      onChange={(event) =>
                        setConfirmedPassword(event.target.value)
                      }
                      required
                    />
                  </label>
                </div>

              <button
                type="submit"
                className="reset-btn"
              >
                Submit
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
                    <a href="" onClick={login}>Go to Dashboard</a>
                  </div>
                </div>)}
            </form>
          </div>
        </section>
      </main>
  );
}

export default ResetPassword;
