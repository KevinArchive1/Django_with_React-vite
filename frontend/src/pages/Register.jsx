import Form from "../components/Form"
import Info from "../components/Info"
import "../styles/Form.css"

function Register() {

    return (
        <div className="Container">
            <div className="Main-content">
                <Form route="/api/user/register/" method="register" />
                <Info 
                    page="Register"
                    description="this is a description register page"
                />
            </div>
        </div>
    )
}

export default Register