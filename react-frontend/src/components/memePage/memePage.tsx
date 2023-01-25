
import * as React from 'react';
import { Navigate } from "react-router-dom";
//@ts-ignore
import HistoryAndTemplatesView from './historyAndTemplates.tsx';
//@ts-ignore
import Editor from './editor.jsx';
import Fab from '@mui/material/Fab';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import { useNavigate } from 'react-router-dom';

function MemePage(){
    const navigate = useNavigate();

    const profileFabClicked = () => {
        console.log("Redirecting to Profilepage.");
        navigate('/profile');
    }


    return(
        <div>
            <div className="Screenlayout" >
                <HistoryAndTemplatesView/>
                <Editor/>
            </div>
            <Fab id="profileBtn" color="secondary" size="large" onClick={profileFabClicked}>
                <Person2RoundedIcon fontSize="large"/>
            </Fab>
        </div>
    )
}

export default MemePage;
