import React, { useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import './pages_css/SignUp.css'


//Note: form is the same as login form, only difference is the handleSubmit function
function SignUp() {
    //creating useState hooks to store the user input
    const [users, setUsers] = useState([])
    const [fname, setFname] = useState('')
    const [mname, setMname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    //useEffect hook to fetch the users from the database
    useEffect(() => {
        fetchUsers();
    }, [])

    //responsible for fetching the users from the database
    const fetchUsers = () => {
        axios
        .get('http://localhost:3001/register') //making HTTP get request to the server(from backend)
        .then((res) => {
            // console.log(res.data)
        })
    }

    //responsible for submitting the users to the database
    const handleSubmit = (event) => {
        //Stops from sending empty form
        event.preventDefault();

         //making HTTP post request to the server(from backend)
        axios.post('http://localhost:3001/register', {fname, mname, lname, email, username, password })
        .then(() => {
            alert('Registration Successful')
            setFname('')
            setMname('')
            setLname('')
            setEmail('')
            setUsername('')
            setPassword('')
            fetchUsers();
            navigate('/login')
        })
        .catch((error) => {
            console.log('Unable to register user')
        })

    }

  return (
    <div className='signup_container'>
        <div className='form_content'>
            <form className='form_main'
            onSubmit={handleSubmit}>
                {/* First Name Input */}
                <label>First Name</label>
                <br />
                <input className='input_container' type='text' placeholder='First Name' value={fname} onChange={(e) => setFname(e.target.value)} />
                <br />
                <br />
                {/* Middle Name Input */}
                <label>Middle Name</label>
                <br />
                <input className='input_container' type='text' placeholder='Middle Name' value={mname} onChange={(e) => setMname(e.target.value)} />
                <br />
                <br />
                {/* Last Name Input */}
                <label>Last Name</label>
                <br />
                <input className='input_container' type='text' placeholder='Last Name' value={lname} onChange={(e) => setLname(e.target.value)} />
                <br />
                <br />
                {/* Email Input */}
                <label>Email</label>
                <br />
                <input className='input_container' type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <br />
                 {/*Username Input */}
                 <label>Username</label>
                <br />
                <input className='input_container' type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <br />
                <br />
                 {/* Password Input */}
                 <label>Password</label>
                <br />
                <input className='input_container' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <br />
                {/* Button */}
                <button className='button' type='submit'>Sign Up</button>
            </form>
        </div>
        <div className='filler'>
            <h2>Sign Up</h2>
        </div>
    </div>
  )
}

export default SignUp