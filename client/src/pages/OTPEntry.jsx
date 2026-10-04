import "./OTPEntry.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import OtpInput from "react-otp-input";


function OTPEntry({email, type}) {
  const navigate = useNavigate();

  if (!email) {
    email = "some.guy@student.curtin.edu.au";
  }

  if (!type) {
    type = "student";
  }

  const [error, setError] = useState("");

  const [OTP, setOTP] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (OTP.length < 5) {
      setError('Please enter OTP');
    } else {
      const response = await fetch(
        'http://localhost:3000/auth/otp',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: email,
                otp: OTP,
                type: type
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
        // change to reset password page passing type parameter
      }
    }
  };

  return (
    <div>
      <main className="main-otp-content">

        <section className="otp-title">
          <h1>One-Time-Password</h1>
        </section>

        <section className="otp-form-container">
          <div className="otp-form-card">
              <form onSubmit={handleSubmit}>

                <div className="otp-form-section">
                  <p>Please enter the OTP sent to your email</p>
                  <OtpInput className="otp-input" value={OTP} onChange={setOTP} inputType="tel" numInputs={5} inputStyle="inputStyle" renderInput={(props) => <input {...props} />} />
                </div>

              <div className="otp-btn">
                <button
                  type="submit"
                >
                  Submit
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

export default OTPEntry;
