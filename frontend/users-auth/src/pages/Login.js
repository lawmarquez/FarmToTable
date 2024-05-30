import React, { useState, useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


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
            console.log('Full response:', response);  

            const token = response.data.token;
            console.log('Token:', token);

            const user_info = response.data.user_info;
            console.log('User Info:', user_info);

            let isAdmin = false;
            if (user_info.userType === 'admin') {
                isAdmin = true;
            }
            if (isAdmin) {
                onLoginSuccess(true);
                navigate('/admin/sales-reports');
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
            localStorage.setItem("userId", user_info.userId);
            localStorage.setItem("userEmail", user_info.userEmail); //Added userEmail to local storage for Account.js
            //console.log(user_info);

        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage('Invalid username or password');
            } else {
                setMessage('Unable to login user');
            }

        }
    };

    return (
        <div className='form_container_login'>
            <iframe 
              className="bg-video"
              src="https://www.youtube.com/embed/dkSpKdY2X4k?autoplay=1&mute=1&controls=0&loop=1&playlist=dkSpKdY2X4k"
              allowFullScreen
              allow="autoplay"
            />

            <div className="half_filler_login">
                    <h1>Welcome back!</h1>
                    <h4>We're glad you are here.</h4>
            </div>

            <div className='form_content_login'>
                <form className='form_main_login' onSubmit={handleLogin}>
                    {/** Usernmae Input */}
                    <br/>
                    <input className="input_container_login" type='text' placeholder=' Username' value={username} onChange={e => setUsername(e.target.value)}/>
                    
                    {/** Password Input */}
                    <br/>
                    <input className="input_container_login" type='password' placeholder=' Password' value={password} onChange={e => setPassword(e.target.value)}/>

                    {/**Button */}
                    <br/>
                    {message && <p2 className="error-message">{message}</p2>}

                    <button className='button_login' type='submit'>Login</button>
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
                </form>
            </div>
        </div>
    );
}

export default Login;
