import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin, onSignup, usernames }) => {
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    const navigate = useNavigate();
  
    const handleUsernameChange = (event) => {
      setUsername(event.target.value);
    };
  
    const handleLogin = () => {
      if (usernames.includes(username)) {
        onLogin(username);
        navigate("/discover");
      } else {
        setErrorMessage("Invalid username. Please try again or sign up.");
      }
    };
  
    const handleSignup = () => {
      if (usernames.includes(username)) {
        setErrorMessage("Username is already taken. Please choose a different one.");
      } else {
        onSignup(username);
        onLogin(username);
        navigate("/discover");
      }
    };
  
  
    return (
        <div>
            <div style={{ background: "#EBFBDB",padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <h1 style={{ color: "#40A62F",  fontSize: "24px" }}>Welcome to the MemeGenerator!</h1></div>
            
            {errorMessage && <div style={{ background: "pink", color: "darkred", display: "flex", alignItems: "center", justifyContent: "center" }}>{errorMessage}</div>}
            
            <div style={{ background: "#8FBC8F", padding: "2rem", height: "100vh", display: "flex", alignItems: "top", justifyContent: "center" }}>
                <div style={{ background: "#fff", padding: "2rem", borderRadius: "0.5rem", width: "20rem", height:"15rem"}}>
                    <label htmlFor="username">Username:</label> 
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                        style={{ marginBottom: "1rem", display: "block", width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.25rem" }}
                    />
                    <button onClick={handleLogin} 
                    style={{ display: "block", 
                    width: "100%", 
                    padding: "0.5rem", 
                    backgroundColor: "#8FBC8F", 
                    color: "#fff", 
                    border: "3px solid #fff", 
                    borderRadius: "1rem" 
                    }}>
                        Login
                    </button>
                    
                    <button onClick={handleSignup} 
                    style={{ display: "block", 
                    width: "100%", 
                    padding: "0.5rem", 
                    backgroundColor: "#8C8C8C", 
                    color: "#fff", 
                    border: "3px solid #fff", 
                    borderRadius: "1rem"
                    }}>
                        Sign Up
                    </button>
    
    </div>
      </div>
      </div>
    );
  };
  

export default Login;
