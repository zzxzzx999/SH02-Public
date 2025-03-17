import axios from 'axios';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Login.css';

function Login(){
    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const [visible, setVisible] = useState(false);

    const navigate = useNavigate(); 

    const handleSubmit = async(event) => {
        event.preventDefault();

        try { 
            const response = await axios.post('http://localhost:8000/api/login/', {
                username,
                password,
            });
            const { token, username: loggedInUsername, is_admin, role} = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('username', loggedInUsername);
            localStorage.setItem('isAdmin', is_admin);
            localStorage.setItem('role', role);
            if (is_admin === true) {
                localStorage.setItem('userRole', "admin");
                navigate('/list-of-companies')
            }
            else {
                localStorage.setItem('userRole', "client");
                navigate('/home')
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.detail || "Invalid username or password.");
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
        }
    };

    const togglePassword = () => {
        setVisible(!visible);
    };

    return (
        <div className = "bubble-container" style={{height:'350px'}}>
        <img src='/GordonText.png' className="gordon-text-logo" alt="Gordon Foley Logo"/>
        <form onSubmit={handleSubmit} className="form">
            <label>
            <input 
                type="text" 
                value={username}
                onChange={(e) => setName(e.target.value)}
                placeholder="Username"
                required
                className = "input"
            />
            </label>
    
            <label  style={{ position: 'relative', width: '100%'}}>
            <input 
                type={visible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className = "input"
                required
            />
            <img 
                className = "show-hide-icons"
                src={visible ? '/show-icon.png' : '/hide-icon.png'} 
                alt={visible ? 'Hide password' : 'Show password'} 
                onClick={togglePassword}
            />
            </label>
            <input className = "submitButton" type="submit" value="LOG IN"/>
        </form>
        {error && <p style={{color:'red'}}>{error}</p>}
        </div>
    )
}

export default Login;