import Form from "../components/Form"
import "../styles/Form.css"
import LoginImage from "../assets/Nobela.png"

function Login() {

    return (
        <div className="Container">
            <div className="Main-content">
                
                <div className="Image-container">
                    <img src={LoginImage} alt="Login Illustration" />
                </div>

                <Form 
                    route="api/token/" 
                    method="login"
                    title="Welcome Back!"
                    subtitle="Login to continue your Nobela account"
                />
            </div>
        </div>
    )
}

export default Login