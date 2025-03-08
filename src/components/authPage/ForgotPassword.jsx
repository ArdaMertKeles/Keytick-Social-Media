import { useState } from "react";
import { auth } from "../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export const ForgotPassword = ({ setForgotPass }) => {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset link sent to your email.");
        } catch (err) {
            setError(getErrorMessage(err.code));
        }
    };

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case "auth/user-not-found":
                return "No user found with this email.";
            case "auth/invalid-email":
                return "Please enter a valid email address.";
            default:
                return "An error occurred. Please try again.";
        }
    };

    return (
        <div className="forgotPassword">
            <h2>Forgot Your Password?</h2>
            <form onSubmit={handlePasswordReset}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="submit">Send Password Reset Email</button>
            </form>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <p onClick={() => setForgotPass(false)}>Back to the sign in</p>
        </div>
    );
};