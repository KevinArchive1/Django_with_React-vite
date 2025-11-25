import Form from "../components/Form"
import Info from "../components/Info"
import "../styles/Form.css"

function Login() {

    return (
        <div className="Container">
            <div className="Main-content">
                <Info 
                    page="Login"
                    description="this is a description page"
                />
                <Form route="/api/token/" method="login"/>  
            </div>
        </div>
    )
}

export default Login