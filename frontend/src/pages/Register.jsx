import Form from "../components/Form"
// import Info from "../components/Info"
import "../styles/Form.css"
import LoginImage from "../assets/Nobela.png"

function Register() {

    return (
        <div className="Container">
            <div className="Main-content">

                <Form 
                    route="/api/user/register/" 
                    method="register"
                    title="Create Your Account"
                    subtitle="Start your journey with us today"
                />

                <div className="Image-container">
                    <img src={LoginImage} alt="Login Illustration" />
                </div>

            </div>
        </div>
    )
}

export default Register