import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import { Link } from "react-router-dom"
import "../styles/Form.css"
import axiosInstance from "../api";

function Form({route, method, title, subtitle}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"
    const location = method === "register" ? "/login" : "/register"

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (method === "register") {

            // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/;

            if (username.length < 8) {
                setErrorMessage("Username must be at least 8 characters.");
                setPassword("");
                setLoading(false);
                return;
            }
            if (password.length < 8) {
                setErrorMessage("Password must be at least 8 characters.");
                setPassword("");
                setLoading(false);
                return;
            }
            // if (!passwordRegex.test(password)) {
            //     setErrorMessage("Password must be contain uppercase, lowercase, a number, and a special character.");
            //     return;
            // }
        }

        try {
            const res = await axiosInstance.post(route, {username, password})
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            setPassword("");

            // Check if server sent a message
            if (error.response?.data?.username) {
                setErrorMessage(error.response.data.username[0]);
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="Main-holder">
            <form onSubmit={handleSubmit} className="form-container">
                {title && <h2 className="form-title">{title}</h2>}
                {subtitle && <p className="form-subtitle">{subtitle}</p>}

                <div className="user-input">
                    <label>Username</label>
                    <input
                        className="font-input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>

                <div className="user-input">
                    <label>Password</label>
                    <input
                        className="font-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>

                <div className="loading-container">
                    {loading && <LoadingIndicator />}
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button className="form-button" type="submit">{name}</button>

                <div className="register-link">
                    {method === "register"
                        ? <span>Already have an account? <Link to="/login">Login</Link></span>
                        : <span>Don't have an account? <Link to="/register">Register</Link></span>
                    }
                </div>
            </form>
        </div>
    )
}

export default Form