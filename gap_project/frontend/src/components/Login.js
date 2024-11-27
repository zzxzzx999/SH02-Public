import React, {useState} from "react";
import '../css/Login.css';

function Login(){
    const [username, setName] = useState("");
    const [password, setPassword] = useState("");

    const [visible, setVisible] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('logged in yay');
    };

    const togglePassword = () => {
        setVisible(!visible);
    };

    return (
        <div className = "bubble-container">
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
    
            <label  style={{ position: 'relative', display: 'block'}}>
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
        </div>
    )
}

export default Login;