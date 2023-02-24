import Create from "./scenes/create";
import Home from "./scenes/home";
import Discover from "./scenes/discover";
import Profile from "./scenes/profile";
import Navbar from "./scenes/navbar";
import Editor from "./scenes/editor";
import Login from "./scenes/login"; // import the Login component
import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, {useState } from "react";

const localserv = "http:/localhost:27017"
  

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // need to change list of usernames to be from backend
  const [usernames, setUsernames] = useState(["carlotta", "sami", "karin"]);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSignup = (username) => {
    setUsernames([...usernames, username]);
  };

  return (
    <>
      {isLoggedIn ? ( // render the content if the user is logged in
        <div className="background">
          <Navbar onLogout={handleLogout}/>
          <div className="container">
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/create" element={<Create />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/editor" element={<Editor />} />
            </Routes>
            
          </div>
        </div>
      ) : (
        <Login
          onLogin={handleLogin}
          onSignup={handleSignup}
          usernames={usernames}
        />
      )}
    </>
  );
}

export default App;


