import "./OTPEntry.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import OtpInput from "react-otp-input";


function OTPEntry({email}) {
  const navigate = useNavigate();

  if (!email) {
    email = "test@gmail.com";
  }

  const [OTP, setOTP] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();


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
                  <p>Please enter the OTP sent to {email}</p>
                  <OtpInput className="otp-input" value={OTP} onChange={setOTP} inputType="tel" numInputs={5} inputStyle="inputStyle" renderInput={(props) => <input {...props} />} />
                </div>

              <div className="otp-btn">
                <button
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

    </div>
  );
}

export default OTPEntry;
