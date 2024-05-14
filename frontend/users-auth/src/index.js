import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import {BrowserRouter} from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


//FOR STARTING FRONTEND
////1. Change to the directory where the auth_server is located (frontend)
//2. Run the command "npm start" in the terminal with the BACKEND running, else it would result to an error

//NOTE: It will automatically open the browser and link to the localhost:3000
//NOTE: To check for open ports, for Windows use: netstat -aon | findstr :3000