
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
    const [triggerUpdate, setTriggerUpdate] = useState(0);
    const [updateMeme, setUpdateMeme] = useState({});
    const [isHistory, setIsHistory] = useState(true);
    const profileFabClicked = () => {
        console.log("Redirecting to Profilepage.");
        navigate('/profile');
    }

    const handleImageUploaded = () => {
        console.log("Image uploaded");
        setTriggerUpdate(triggerUpdate + 1);
    };

    const handleEditMeme = (memeData) => {
        console.log("In MemePage-handleEditMeme");
        // console.log(memeData);
        setUpdateMeme(memeData);
    }

    const updateHistory = (isHistoryParameter) => {
        console.log(isHistoryParameter);
        setIsHistory(isHistoryParameter);
    }

    return (
        <div>
            <div className="Screenlayout" >
                <HistoryAndTemplatesView updateTrigger={triggerUpdate} handleEditMeme={handleEditMeme} updateIsHistory={updateHistory}/>
                <Editor handleImageUploaded={handleImageUploaded} receivedMemeData={updateMeme} updateSetIsHistory={isHistory}/>
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
