/* reset password */
import { useState } from "react";

function ResetPassword() {

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [password, setPassword] = useState("");
    const [reconfirmPassword, setReconfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                    reconfirmPassword: reconfirmPassword
                })
            }
        );

        const data = await response.json();
        if(!response.ok) {
            setError(data.message);
            setMessage("");
        }
        else {
            setMessage(data.message);
            setError("");
        }
    };

    return(
        <div className="form-container">
            <div className="form-box">
                <form onSubmit={handleSubmit}>
                    <h1>
                        Reset your Password
                    </h1>
                    
                    <h3> 
                        Create a strong password to secure your account
                    </h3>
                    <label> New password </label>
                    <input 
                        type="password"
                        name="newPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="new password"
                    />

                    <label> Re-enter new password </label>
                    <input 
                        type="password"
                        name="confirmPassword"
                        value={reconfirmPassword}
                        onChange={(e) => setReconfirmPassword(e.target.value)}
                        placeholder="re-enter new password"
                    />

                    <button type="submit">
                        Reset Password
                    </button>

                    {error && (
                        <p className="error">
                            {error}
                        </p>)}

                    {message && (
                        <p className="message">
                            {message}
                        </p>)}
                </form>
            </div>
        </div>
    )
}

export default ResetPassword;