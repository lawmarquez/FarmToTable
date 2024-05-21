import React, { useState, useEffect} from 'react'
import axios from 'axios'
import {Navigate, useNavigate, userNavigate} from 'react-router-dom'


import './pages_css/Login.css';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        // Fetching users from the database
        try {
            const response = await axios.get('http://localhost:3001/register');
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/login', { username, password });
            // console.log('Full response:', response);  

            const token = response.data.token;
            // console.log('Token:', token);

            const user_info = response.data.user_info;
            // console.log('User Info:', user_info);

            let isAdmin = false;
            if (user_info.userType === 'admin') {
                isAdmin = true;
            }
            if (isAdmin) {
                onLoginSuccess(true);
                navigate('/admin-account');
            } else {
                onLoginSuccess(false);
                // navigate('/account');
                // change navigate route to /shop
                navigate('/shop');
            }

            onLoginSuccess(token, isAdmin);

            setUsername('');
            setPassword('');
            setMessage(''); // Clear any previous message
            localStorage.setItem('token', token);
            localStorage.setItem("isAdmin", isAdmin);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage('Invalid username or password');
            } else {
                setMessage('Unable to login user');
            }

        }
    };

    return (
        <div className='form_container'>
            <div className='form_content'>
                <div className="loginText">
                    <h1>Welcome back!</h1>
                    <h4>We're glad you are here.</h4>
                    <br/>
                    <br/>
                </div>
                <form className='form_main' onSubmit={handleLogin}>
                    <br/>
                    <br/>
                    <input className='input_container' type='text' placeholder=' Username' value={username} onChange={e => setUsername(e.target.value)}/>
                    <br/>
                    <br/>
                    <input className='input_container' type='password' placeholder=' Password' value={password} onChange={e => setPassword(e.target.value)}/>
                    <br/>
                    <br/>
                    {message && <p className="error-message">{message}</p>}
                    <button className='button' type='submit'>Login</button>
                </form>
            </div>

            {/* <div className='filler'>
                <h2>LOGIN</h2>
            </div> */}
        </div>
    );
}

export default Login;
