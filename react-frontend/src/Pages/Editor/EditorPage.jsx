import { Container, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';
import styles from './editor.module.css'

/**
 * EditorPage component for editing images.
 * @returns {JSX.Element} The rendered EditorPage component.
 */
const EditorPage = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    /**
     * Handles the selection of an image file.
     * @param {Event} event - The file input change event.
     */
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
        setShowPopup(false);
    };

    /**
     * Handles the change of the image URL input.
     * @param {Event} event - The input change event.
     */
    const handleImageUrlChange = (event) => {
        setImageUrl(event.target.value);
    };

    /**
     * Handles the addition of an image URL.
     */
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
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

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




        
        /*
        // Paul's code commented out
        <Container fluid className="vh-100">
            <Row className="h-100">
                <Col className="bg-coral d-flex align-items-center justify-content-center">Editor is displayed here</Col>
            </Row>
        </Container>

         */
