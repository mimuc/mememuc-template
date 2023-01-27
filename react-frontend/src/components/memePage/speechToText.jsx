import React, { useState } from 'react';
import MicIcon from '@mui/icons-material/Mic';

function SpeechToText({ speechHandler }) {
    const [speakTranscript, setSpeakTranscript] = useState('');
    const [currentlySpeaking, setCurrentlySpeaking] = useState(false);

    const handleListen = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        if(!currentlySpeaking) {
            recognition.start();
            setCurrentlySpeaking(true);
        } else if(currentlySpeaking) {
            console.log("Aborting recognition")
            recognition.abort();
            setCurrentlySpeaking(false);
        }

        recognition.onresult = (event) => {
            setSpeakTranscript(event.results[0][0].transcript);
            speechHandler(event.results[0][0].transcript);
            setCurrentlySpeaking(false);
        };
        recognition.onerror = () => {
            setCurrentlySpeaking(false);
        }
        recognition.onaudioend = () => {
            setCurrentlySpeaking(false);
        }
    };

    return (
        <>
            {!currentlySpeaking && <MicIcon className="formatIcon" color="primary" id="speechToText" onClick={handleListen} />}
            {currentlySpeaking && <MicIcon className="formatIcon" style={{ color: '#EE0000' }} id="speechToText" onClick={handleListen} />}
        </>
    );
}

export default SpeechToText;