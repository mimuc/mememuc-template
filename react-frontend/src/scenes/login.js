import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {createUser} from "../callback/callback_user"
const localserver = "http://localhost:3001";

const Login = ({ onLogin, onSignup, usernames }) => {
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    const navigate = useNavigate();
  
    const handleUsernameChange = (event) => {
      setUsername(event.target.value);
    };
  
    const handleLogin = () => {
      
      fetch(`${localserver}/users?connexion_name=${username}`)
      .then(res => res.json())
      .then(data => {
        console.log("data:"+data);
        localStorage.clear();
        localStorage.setItem("username",username);
        navigate("/discover");
      })
      .catch((error)=>{setErrorMessage("error: username not found")});
      /*if (usernames.includes(username)) {
        onLogin(username);
        navigate("/discover");
      } else {
        setErrorMessage("Invalid username. Please try again or sign up.");
      }*/
    };
  
    const handleSignup =  () => {
        var isTaken = false;
         fetch(`${localserver}/users?connexion_name=${username}`)
        .then(res => res.json())
        .then(data => {
          console.log("in signup data:"+data);
          if (data.connexion_name === username ){
            isTaken = true;
            console.log("user already taken");
            setErrorMessage("User already taken")
          }
          
        })
        console.log("istaken is "+isTaken)
        if (isTaken === false){
           fetch(localserver+`/users/create?username=${username}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(() => {
            localStorage.setItem("username",username);
            console.log("username created "+username)
            }
            )
            .catch(error => setErrorMessage("signup didnt work, please retry"));
          }
        /*onSignup(username);
        onLogin(username);*/
        navigate("/discover");
      
    };
  
  
    return (
        <div>
            <div style={{ background: "#EBFBDB",padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <h1 style={{ color: "#40A62F",  fontSize: "24px" }}>Welcome to the MemeGenerator!</h1></div>      
            {errorMessage && <div style={{ background: "pink", color: "darkred", display: "flex", alignItems: "center", justifyContent: "center" }}>{errorMessage}</div>}
            <div style={{ background: "#8FBC8F", color: "white", paddingTop: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>Please sign up or log in to continue...</div>
            <div style={{ background: "#8FBC8F", padding: "1.5rem", height: "100vh", display: "flex", alignItems: "top", justifyContent: "center" }}>
                
                <div style={{ background: "#fff", padding: "2rem", borderRadius: "0.5rem", width: "20rem", height:"15rem"}}>
                    <label style={{ color: "#40A62F"}} htmlFor="username">Username:</label> 
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
