import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function LogIn() {
  const navigate = useNavigate();

  const [userType, setUserType] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();


  };

  return (
    <div className="landing-container">
      <main className="main-content">

        <section className="greeting">
          <h1>Log In</h1>
        </section>

        <section className="units-section">
          <div className="unit-card">
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
