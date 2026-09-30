import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();


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
                  <div className="email-label">
                    <label>Account Email</label>
                  </div>
                  <input
                      type="text"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      required
                  />
                </div>

              <div className="verify-btn">
                <button
                  type="submit"
                >
                Verify Details
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

    </div>
  );
}

export default ForgotPassword;
