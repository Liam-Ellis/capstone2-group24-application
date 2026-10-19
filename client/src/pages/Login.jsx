import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import backendURL from "../backendURL";


function LogIn() {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [userType, setUserType] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const response = await fetch(
      `${backendURL}/auth/login`,
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              username: email,
              password: password,
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
        switch (userType) {
          case 'Student':
            navigate('/studentdashboard');
            break;
          case 'Staff':
            navigate('/ucdashboard');
            break;
        }
    }
  };

  return (
    <div>
      <main className="main-login-content">

        <section className="title">
          <h1>Log In</h1>
        </section>

        <section className="login-form-container">
          <div className="form-card">
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

                  <label>
                    Password
                    <input
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      required
                    />
                  </label>
                </div>

              <button
                type="submit"
                className="log-in-btn"
              >
                Log In
              </button>

              {error && (
                <div className="error-msg-div">
                  <p>{error}</p>
                </div>)}
            </form>
          </div>
        </section>

        <section className="links">
          <a href="" onClick={() => {navigate("/setup");}}>Create an account</a>
          <a href="" onClick={() => {navigate("/forgot");}}>Forgot password</a>
        </section>
      </main>

    </div>
  );
}

export default LogIn;
