import React, { useState, useEffect} from 'react'
import axios from 'axios'
import {Navigate, useNavigate, userNavigate} from 'react-router-dom'

import './pages_css/Login.css'

function Login({ onLoginSuccess }) {
    //creating useState hooks to store the user input
    const [username, setUsername] = useState([])
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    //useEffect hook to fetch the users from the database
    useEffect(() => {
        fetchUsers();
    }, [])

    //responsible for fetching the users from the database
    const fetchUsers = async () => {
        axios.get('http://localhost:3001/register') //making HTTP get request to the server(from backend)
        .then((res)=>{
            console.log(res.data)})
    }

    const handleLogin = async(event)=>{
        //Stops from sending empty form
        event.preventDefault();

        //making HTTP post request to the server(from backend)
        try{
            const response = await axios.post('http://localhost:3001/login', {username, password})
            const token = response.data.token

            let isAdmin = false;
            if (username === 'admin') {
                isAdmin = true;
            }

            if (isAdmin) {
                onLoginSuccess(true);
                navigate('/admin-account');
            } else {
                onLoginSuccess(false);
                navigate('/account');
            }

            onLoginSuccess(token, isAdmin);

            setUsername('');
            setPassword('');
            fetchUsers();
            localStorage.setItem('token', token);
            localStorage.setItem("isAdmin", isAdmin);
        }catch(err){
            console.log('Unable to login user')
        }
    }


  return (
    
    <div className='form_container'>
        <iframe 
          class="bg-video"
          src="https://www.youtube.com/embed/dkSpKdY2X4k?autoplay=1&mute=1&controls=0&loop=1&playlist=dkSpKdY2X4k"
          allowFullScreen
          allow="autoplay"
        />
        
        
        <div className='half_filler'>
            <h2>Welcome back!</h2>
            <p>We're glad you are here.</p>
        </div>

        <div className='form_content'>
            <form className='form_main' onSubmit={handleLogin}>
                {/** Usernmae Input */}
                <br/>
                <input className='input_container' type='text' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)}/>

                {/** Password Input */}
                <br/>
                <input className='input_container' type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>

                {/**Button */}
                <br/>
                <button className='submit_button' type='submit'>Log me in!</button>
                
                <br/>
                <br/>
                <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
            </form>
        </div>
    </div>
  )
}

export default Login