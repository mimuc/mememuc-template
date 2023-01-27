import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import Fab from '@mui/material/Fab';

const videoConstraints = {
    width: window.innerWidth,
    height: window.innerHeight,
    facingMode: "user"
};

function Camera({ showCamera, handleScreenshot }) {

    const webcamRef = useRef(null);
    const [url, setUrl] = useState(null);
    const [showCameraBoolean, setShowCameraBoolean] = useState(showCamera);
    const [captureBtnDisabled, setCaptureBtnDisabled] = useState(true)

    const capturePhoto = React.useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setUrl(imageSrc);
        setShowCameraBoolean(false);
        handleScreenshot(imageSrc);
    }, [webcamRef]);

    const onUserMedia = (e) => {
        setCaptureBtnDisabled(false);
        //console.log(e);
    };

    return (
        <>
            <Fab disabled={captureBtnDisabled} id="webcamCapture" onClick={capturePhoto} variant="extended" color="primary">Capture</Fab>
            {showCameraBoolean && <Webcam
                className="roundedCorner"
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.88}
                videoConstraints={videoConstraints}
                onUserMedia={onUserMedia}
                mirrored={true}
            />}
            
        </>
    );
};

export default Camera