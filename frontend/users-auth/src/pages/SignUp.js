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
        <iframe 
          class="bg-video"
          src="https://www.youtube.com/embed/cGNbq0-fdRk?autoplay=1&mute=1&controls=0&loop=1&playlist=cGNbq0-fdRk"
          allowFullScreen
          allow="autoplay"
        />

        <div className='half_filler1'>
            <h3>Let's create an account</h3>
            <p2>And start your freshness shopping with us!</p2>
        </div>

        <div className='form_content1'>
            <form className='form_main1' onSubmit={handleSubmit}>
                {/* First Name Input */}
                <br />
                <input className='input_container1' type='text' placeholder='First Name' value={fname} onChange={(e) => setFname(e.target.value)} />
                <br />
                {/* Middle Name Input */}
                <br />
                <input className='input_container1' type='text' placeholder='Middle Name' value={mname} onChange={(e) => setMname(e.target.value)} />
                <br />
                {/* Last Name Input */}
                <br />
                <input className='input_container1' type='text' placeholder='Last Name' value={lname} onChange={(e) => setLname(e.target.value)} />
                <br />
                {/* Email Input */}
                <br />
                <input className='input_container1' type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                {/*Username Input */}
                <br />
                <input className='input_container1' type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <br />
                {/* Password Input */}
                <br />
                <input className='input_container1' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                {/* Button */}
                <button className='submit_button1' type='submit'>Sign Up</button>

                <br />
                <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
            </form>
        </div>
        
    </div>
  )
}

export default SignUp