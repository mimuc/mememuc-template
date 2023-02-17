import * as React from 'react';
import Fab from '@mui/material/Fab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import MemeSlider from './memeSlider.tsx';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("my super cool username");

    const backFabClicked = () => {
        console.log("Redirecting to Memepage.");
        navigate('/memePage');
    }

    fetch('http://localhost:3001/users/my_username', {
        method: 'GET',
        credentials: 'include'
    }).then((res) => {
        if (res.ok) {
            return res.text();
        }
        else {
            console.log("Error getting username");
        }
    }).then((res) => {
        console.log(res);
        setUsername(res);
    });

    return (
        <div id="profile-page-container">
            <p id="username-display"><strong>Username:</strong> { username }</p>
            <div id="my-memes-container">
                <h2>My Created Memes</h2>
                <MemeSlider src="/mymemes"/>
            </div>
            <div id="my-drafts-container">
                <h2>My Unfinished Drafts:</h2>
                <MemeSlider src="/mydrafts"/>
            </div>
            <Fab id="profileBtn" color="secondary" size="large" onClick={backFabClicked}>
                <ArrowBackIcon fontSize="large"/>
            </Fab>
        </div>
    );
};

export default ProfilePage;