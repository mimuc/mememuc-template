import * as React from 'react';
import Fab from '@mui/material/Fab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import MemeSlider from './memeSlider.tsx';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();

    const backFabClicked = () => {
        console.log("Redirecting to Memepage.");
        navigate('/memepage');
    }

    return (
        <div id="profile-page-container">
            <p><strong>Username:</strong> --blank--</p>
            <p><strong>super penis!</strong></p>
            <div id="my-memes-container">
                <h2>My Created Memes</h2>
                <MemeSlider src="some created memes url"/>
            </div>
            <div id="my-drafts-container">
                <h2>My Unfinished Drafts:</h2>
                <MemeSlider src="some draft memes url"/>
            </div>
            <Fab id="profileBtn" color="secondary" size="large" onClick={backFabClicked}>
                <ArrowBackIcon fontSize="large"/>
            </Fab>
        </div>
    );
};

export default ProfilePage;