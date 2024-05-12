import Reac, { useState, useEffect} from 'react'
import axios from 'axios'
import {Navigate, useNavigate, userNavigate} from 'react-router-dom'

import './pages_css/Login.css'

function Login() {
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
            alert('User Logged In')
            setUsername('')
            setPassword('')
            fetchUsers()
            navigate('/account')
            window.location.reload()
            localStorage.setItem('token', token)
        }catch(err){
            console.log('Unable to login user')
        }
    }


  return (
    <div className='form_container'>
        <div className='form_content'>
            <form className='form_main' onSubmit={handleLogin}>
                {/** Usernmae Input */}
                <label> Username </label>
                <br/>
                <input className='input_container' type='text' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)}/>
                <br/>
                <br/>

                {/** Password Input */}
                <label> Password </label>
                <br/>
                <input className='input_container' type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                <br/>
                <br/>

                {/**Button */}
                <button className='button' type='submit'>Login</button>
            </form>
        </div>

        <div className='filler'>
            <h2>LOGIN</h2>

        </div>
    </div>
  )
}

export default Login