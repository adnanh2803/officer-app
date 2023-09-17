import { useContext, useEffect, useState } from 'react'
import {Form, Button} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../hooks/Auth/UserContext'
import auth from '../../services/Auth/auth-api'
import withAuth from '../../services/Auth/axios-with-auth'
import { showToast } from '../ApplicationSettings/Components/ToastUtils'
import './AuthForms.scss'
function LoginView() {
    const navigate = useNavigate()
    const {login,user,privilages} = useContext(UserContext)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    async function loginUser(e){
        e.preventDefault();
        if(!username || !password) return
        let res = await auth.login(username, password);
        login(res.data)
        // navigate('/')
    }
    useEffect(()=>{
        if(user){
            navigate('/')
        }
    },[user,privilages])
    return (
        <div className="Login">
            <h1>Welcome to Officer</h1>
            <br/>
            <h3>Login</h3>
            <br/>
            <Form onSubmit={loginUser}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control onChange={(e)=> setUsername(e.target.value)} type="text" placeholder="Enter Username" required/>
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
                <Button type='submit' variant="primary">
                    Login
                </Button>
            </Form>
            <Link to={'/register'}>Register</Link>
        </div>
    )
}

export default LoginView