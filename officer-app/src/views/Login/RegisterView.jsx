import { useContext, useState } from 'react'
import {Form, Button} from 'react-bootstrap'
import {Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../hooks/Auth/UserContext'
import auth from '../../services/Auth/auth-api'
import './AuthForms.scss'
function RegisterView() {
    const navigate = useNavigate()
    const {login} = useContext(UserContext)
    const [activationCode, setActivationCode] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('')
    async function loginUser(){
        if(!activationCode || !password || !email) return
        let res = await auth.register(activationCode, password, email)
        console.log(res.data)
        login(JSON.stringify(res.data))
        navigate('/')
    }
    return (
        <div className="Register">
            <h1>Welcome to Officer</h1>
            <br/>
            <h3>Register</h3>
            <br/>
            <Form>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Company email</Form.Label>
                    <Form.Control onChange={(e)=> setEmail(e.target.value)} type="text" placeholder="Enter email" required/>
                    {/* <Form.Text className="text-muted">
                        Use email provided by the company
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="activation-code">
                    <Form.Label>Activation Code</Form.Label>
                    <Form.Control onChange={(e)=> setActivationCode(e.target.value)} type="text" placeholder="Enter Activation Code" required/>
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={(e)=> setPassword(e.target.value)} type="password" placeholder="Password" required/>
                </Form.Group>
                {/* <Form.Group className="mb-3" controlId="checkbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group> */}
                <Button variant="primary" onClick={(e)=>{e.preventDefault(); loginUser()}}>
                    Register
                </Button>
            </Form>
            <Link to={'/login'}>Login</Link>
        </div>
    )
}

export default RegisterView