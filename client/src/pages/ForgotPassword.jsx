import "./ForgotPassword.css";
import { useState } from "react";
import OTPEntry from "./OTPEntry";
import ResetPassword from "./ResetPassword";
import backendURL from "../backendURL";

function ForgotPassword() {
  const [error, setError] = useState("");

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("Student");

  const nextStep = () => {
    setStep(step + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const response = await fetch(
      `${backendURL}/auth/forgotPassword`,
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
      nextStep();
    }
  };

  return (
    <div>
      {step === 1 && (
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
      )}

      {step === 2 && (
        <OTPEntry
          email={email}
          type={userType.toLowerCase()}
          nextStep={nextStep}
        />
      )}

      {step === 3 && (
        <ResetPassword
          userType={userType.toLowerCase()}
        />
      )}
    </div>
  );
}

export default ForgotPassword;
