
import * as React from 'react';
import { Navigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
//@ts-ignore
import HistoryAndTemplatesView from './historyAndTemplates.tsx';
//@ts-ignore
import Editor from './editor.jsx';
import Fab from '@mui/material/Fab';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import { useNavigate } from 'react-router-dom';
import {useState} from "react";

function MemePageIfLoggedIn () {
    const navigate = useNavigate();
    const profileFabClicked = () => {
        console.log("Redirecting to Profilepage.");
        navigate('/profile');
    }

    return (
        <div>
            <div className="Screenlayout" >
                <HistoryAndTemplatesView/>
                <Editor/>
            </div>
            <Fab id="profileBtn" color="secondary" size="large" onClick={profileFabClicked}>
                <Person2RoundedIcon fontSize="large"/>
            </Fab>
        </div>
    );
}

function MemePageBeforeLoggedIn() {
    return (
      <div id="wait-container">
          <CircularProgress />
          <h1 id="wait-header">Greetings! Please wait while we check, if you are allow to access this site.</h1>
      </div>
    );
}


function MemePage(){
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

    fetch('http://localhost:3001/users/loggedin', {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Content-Type": "application/json"
        },
        credentials: "include"
    }).then((res) => {
        console.log("User logged in?");
        console.log(res.status);
       if (!res.ok) {
           navigate('/')
       } else {
           setLoggedIn(true);
       }
    });

    if(loggedIn) {
        return <MemePageIfLoggedIn/>
    } else {
        return  <MemePageBeforeLoggedIn/>
    }

}

export default MemePage;
