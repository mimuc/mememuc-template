import * as React from 'react';
import Fab from '@mui/material/Fab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const navigate = useNavigate();

    const backFabClicked = () => {
        console.log("Redirecting to Memepage.");
        navigate('/memepage');
    }

    return (
        <div>
            <p><strong>super penis!</strong></p>
            <Fab id="profileBtn" color="secondary" size="large" onClick={backFabClicked}>
                <ArrowBackIcon fontSize="large"/>
            </Fab>
        </div>
    );
}