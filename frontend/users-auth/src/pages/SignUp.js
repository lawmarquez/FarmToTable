import React, { useState, useEffect } from 'react';
import axios from 'axios';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';

import './pages_css/SignUp.css';

function SignUp() {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [mname, setMname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fnameError, setFnameError] = useState('');
    const [lnameError, setLnameError] = useState('');
    // const [mnameError, setMnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:3001/register')
            .then((res) => {
                // console.log(res.data)
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        validateForm();

        // If any error exists, return without submitting
        if (fnameError || lnameError || emailError || usernameError || passwordError) {
            return;
        }

        // Making HTTP post request to the server
        axios.post('http://localhost:3001/register', { fname, lname, mname, email, username, password })
            .then(() => {
                alert('Registration Successful');
                setFname('');
                setLname('');
                setMname('');
                setEmail('');
                setUsername('');
                setPassword('');
                clearErrors();
                fetchUsers();
                navigate('/login');
            })
            .catch((error) => {
                console.error('Unable to register user:', error);
            });
    };

    const validateForm = () => {
        setFnameError(validateField(fname, 'First Name'));
        setLnameError(validateField(lname, 'Last Name'));
        // setMnameError(validateField(mname, 'Middle Name'));
        setEmailError(validateEmail(email));
        setUsernameError(validateField(username, 'Username'));
        setPasswordError(validateField(password, 'Password'));
    };

    const validateField = (value, fieldName) => {
        if (!value) {
            return `${fieldName} is required`;
        }
        return '';
    };

    const validateEmail = (value) => {
        if (!value) {
            return 'Email is required';
        }
        if (!validator.isEmail(value)) {
            return 'Invalid email format';
        }
        return '';
    };

    const clearErrors = () => {
        setFnameError('');
        setLnameError('');
        // setMnameError('');
        setEmailError('');
        setUsernameError('');
        setPasswordError('');
    };

    return (
        <div className='signup_container'>
            <iframe 
              class="bg-video"
              src="https://www.youtube.com/embed/cGNbq0-fdRk?autoplay=1&mute=1&controls=0&loop=1&playlist=cGNbq0-fdRk"
              allowFullScreen
              allow="autoplay"
            />

            <div className='half_filler_signup'>
                <h3>Let's create an account</h3>
                <p2>And start your freshness shopping with us!</p2>
            </div>

            <div className='form_content_signup'>
                <form className='form_main_signup' onSubmit={handleSubmit}>
                    <br />
                    <input className='input_container_signup' type='text' placeholder=' First Name' value={fname} onChange={(e) => setFname(e.target.value)} />
                    {fnameError && <p className="error-message">{fnameError}</p>}
                    <br />
                    <input className='input_container_signup' type='text' placeholder=' Middle Name' value={mname} onChange={(e) => setMname(e.target.value)} />
                    {/* {mnameError && <p className="error-message">{mnameError}</p>} */}
                    <br />
                    <input className='input_container_signup' type='text' placeholder=' Last Name' value={lname} onChange={(e) => setLname(e.target.value)} />
                    {lnameError && <p className="error-message">{lnameError}</p>}
                    <br />
                    <input className='input_container_signup' type='text' placeholder=' Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    {emailError && <p className="error-message">{emailError}</p>}
                    <br />
                    <input className='input_container_signup' type='text' placeholder=' Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                    {usernameError && <p className="error-message">{usernameError}</p>}
                    <br />
                    <input className='input_container_signup' type='password' placeholder=' Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                    <br />
                    <button className='button_signup' type='submit'>Sign Up</button>
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
