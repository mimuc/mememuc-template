import React, { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import styles from './editor.module.css';

const EditorPage = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [text, setText] = useState('');
    const [textColor, setTextColor] = useState('black');
    const [textSize, setTextSize] = useState(20);
    const [textX, setTextX] = useState(50);
    const [textY, setTextY] = useState(50);
    const [canvasWidth, setCanvasWidth] = useState(400);
    const [canvasHeight, setCanvasHeight] = useState(300);
    const canvasRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Ensure canvas is available
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image
        if (selectedImage) {
            const image = new Image();
            image.src = selectedImage;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                // Draw text on top of the image
                ctx.fillStyle = textColor;
                ctx.font = `${textSize}px Arial`;
                ctx.fillText(text, textX, textY);
            };
        }
    }, [selectedImage, text, textColor, textSize, textX, textY]);

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
        setShowPopup(false);
    };

    const handleImageUrlChange = (event) => {
        setImageUrl(event.target.value);
    };

    const handleAddImageUrl = () => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const extension = imageUrl.substring(imageUrl.lastIndexOf('.')).toLowerCase();
        if (imageExtensions.includes(extension)) {
            setSelectedImage(imageUrl);
        } else {
            alert('Please provide a valid image URL.');
        }
        setShowPopup(false);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleTextColorChange = (event) => {
        setTextColor(event.target.value);
    };

    const handleTextSizeChange = (event) => {
        setTextSize(parseInt(event.target.value));
    };

    const handleTextXChange = (event) => {
        setTextX(parseInt(event.target.value));
    };

    const handleTextYChange = (event) => {
        setTextY(parseInt(event.target.value));
    };

    const handleCanvasWidthChange = (event) => {
        setCanvasWidth(parseInt(event.target.value));
    };

    const handleCanvasHeightChange = (event) => {
        setCanvasHeight(parseInt(event.target.value));
    };

    const handleSaveImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Ensure canvas is available
        const image = canvas.toDataURL('image/png');
        // Implement saving logic here, e.g., using fetch to send the image data to a server
    };

    return (
        <Container>
            <h1 className={styles.center}>EDITOR</h1>
            <button onClick={togglePopup}>Select Image</button>
            {showPopup && (
                <div className="popup">
                    <input type="file" accept="image/*" onChange={handleImageSelect} />
                    <input type="text" placeholder="Enter Image URL" value={imageUrl} onChange={handleImageUrlChange} />
                    <button onClick={handleAddImageUrl}>Add Image</button>
                </div>
            )}
            {selectedImage && (
                <div>
                    <input type="text" value={text} onChange={handleTextChange} />
                    <input type="color" value={textColor} onChange={handleTextColorChange} />
                    <input type="number" value={textSize} onChange={handleTextSizeChange} />
                    <input type="number" value={textX} onChange={handleTextXChange} />
                    <input type="number" value={textY} onChange={handleTextYChange} />
                    <input type="number" value={canvasWidth} onChange={handleCanvasWidthChange} />
                    <input type="number" value={canvasHeight} onChange={handleCanvasHeightChange} />
                    <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
                    <button onClick={handleSaveImage}>Save Image</button>
                </div>
            )}
        </Container>
    );
};

export default EditorPage;





/*
import { Container, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';
import styles from './editor.module.css'

/**
 * EditorPage component for editing images.
 * @returns {JSX.Element} The rendered EditorPage component.
 */
/*
const EditorPage = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [text, setText] = useState('');
    const [textColor, setTextColor] = useState('white');
    const [textSize, setTextSize] = useState('20');
    const [textX, setTextX] = useState(50);
    const [textY, setTextY] = useState(50);
    const [canvasWidth, setCanvasWidth] = useState(500)
    const [cavasHeight, setCanvasHeight] = useState(400)
    const canvasRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image
        if (image) {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
        // Draw text
        ctx.fillStyle = textColor;
        ctx.font = `${textSize}px Arial`;
        ctx.fillText(text, textX, textY);
    }, [image, text, textColor, textSize, textX, textY]);

    /**
     * Handles the selection of an image file.
     * @param {Event} event - The file input change event.
     */

/*
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
        setShowPopup(false);
    };
/*
    /**
     * Handles the change of the image URL input.
     * @param {Event} event - The input change event.
     */


/*
    const handleImageUrlChange = (event) => {
        setImageUrl(event.target.value);
    };

    /**
     * Handles the addition of an image URL.
     */

/*
    const handleAddImageUrl = () => {
        // Check if the provided URL is an image
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const extension = imageUrl.substring(imageUrl.lastIndexOf('.')).toLowerCase();
        if (imageExtensions.includes(extension)) {
            setSelectedImage(imageUrl);
        } else {
            alert('Please provide a valid image URL.');
        }
        setShowPopup(false);
    };

    /**
     * Toggles the image selection popup.
     */

/*
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    */

    /*


    return (
        <div>
            <h1 className={styles.center}>EDITOR</h1>
            <button onClick={togglePopup}>Select Image</button>
            {showPopup && (
                <div className="popup">
                    <input type="file" accept="image/*" onChange={handleImageSelect} />
                    <input type="text" placeholder="Enter Image URL" value={imageUrl} onChange={handleImageUrlChange} />
                    <button onClick={handleAddImageUrl}>Add Image</button>
                </div>
            )}
            {selectedImage && <img src={selectedImage} alt="Selected Image" />}
        </div>
    );
};

export default EditorPage;



*/
        
        /*
        // Paul's code commented out
        <Container fluid className="vh-100">
            <Row className="h-100">
                <Col className="bg-coral d-flex align-items-center justify-content-center">Editor is displayed here</Col>
            </Row>
        </Container>

         */
