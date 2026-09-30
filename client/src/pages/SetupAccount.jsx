import "./SetupAccount.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function SetupAccount() {
  const navigate = useNavigate();

  const [userType, setUserType] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();


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
                className="setup-btn"
              >
                Create Account
              </button>
            </form>
          </div>
        </section>
      </main>

    </div>
  );
}

export default SetupAccount;
