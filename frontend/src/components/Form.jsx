import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import { Link } from "react-router-dom"
import "../styles/Form.css"

function Form({route, method}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"

    const location = method === "register" ? "/login" : "/register"

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, {username, password})

            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return <div className="Main-holder">
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <div className="user-input">
                <h1>Username</h1>
                <input
                    className="font-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
            </div>
            <div className="user-input">
                <h1>Password</h1>
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
            <button className="form-button" type="submit">
                {name} 
            </button>
            <Link to={location}>
                <button>
                    {method === "register" ? "Login" : "Register"}
                </button>
            </Link>
        </form>
    </div>
}

export default Form