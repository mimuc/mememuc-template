
    import React, { useState, useEffect, useRef } from 'react';
    import { Container} from 'react-bootstrap';
    import styles from './editor.module.css';


    const EditorPage = () => {
        const [showPopup, setShowPopup] = useState(false);
        const [selectedImage, setSelectedImage] = useState('');
        const [imageUrl, setImageUrl] = useState('');
        const [text, setText] = useState('');
        const [textColor, setTextColor] = useState('black');
        const [textSize, setTextSize] = useState(20);
        const [textStyle, setTextStyle] = useState('');
        const [textX, setTextX] = useState(50);
        const [textY, setTextY] = useState(50);
        const [outlineColor, setOutlineColor] = useState('#000000'); // State for outline color
        const [outlineThickness, setOutlineThickness] = useState(2); // State for outline thickness

        const canvasRef = useRef();
        const [canvasColor, setCanvasColor] = useState('white'); // Canvas color state
        const [imageSizeOption, setImageSizeOption] = useState('cover'); // New state for image size option
        const [fontFamily, setFontFamily] = useState('Arial');
        const [showColorPopup, setShowColorPopup] = useState(false); // State for showing the canvas color popup
        const [tempCanvasColor, setTempCanvasColor] = useState('white'); // Temporary canvas color
        

        //const [gifUrl, setGifUrl] = useState('');

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return; // Ensure canvas is available
            const ctx = canvas.getContext('2d');

            // Clear canvas
            ctx.fillStyle = canvasColor; // Set canvas color
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            

            // Draw image
            if (selectedImage) {
                const image = new Image();
                image.src = selectedImage;
                image.onload = () => {
                    // Calculate image dimensions based on the canvas size and selected option
                    let imageWidth = imageSizeOption === 'cover' ? canvas.width : canvas.width * 0.8;
                    let imageHeight = imageSizeOption === 'cover' ? canvas.height : canvas.height * 0.8;
                    
                    // Calculate image position based on canvas size and selected option
                    const imageX = (canvas.width - imageWidth) / 2;
                    const imageY = (canvas.height - imageHeight) / 2;

                    // Render the image
                    ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);
                    
                    // Clear the area for the image to prevent overlapping texts on multiple updates
                    //ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Set the font using the selected fontFamily and textSize
                    ctx.font = `${textSize}px ${fontFamily}`;
                    ctx.fillText(text, textX, textY);

                    // Draw text on top of the image
                    ctx.fillStyle = textColor;  

                    // Apply text outline
                    ctx.shadowColor = outlineColor;
                    ctx.shadowBlur = outlineThickness;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.fillText(text, textX, textY);
                };
            }
        }, [selectedImage, text, textColor, textSize, textX, textY, textStyle, canvasColor, imageSizeOption, outlineColor, outlineThickness, fontFamily]);

        
        const confirmCanvasColorChange = () => {
            setCanvasColor(tempCanvasColor);
            setShowColorPopup(false); 
        }; // Handler to confirm the canvas color change

        const toggleColorPopup = () => {
            setShowColorPopup(!showColorPopup);
        };
        
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

        const handleSaveImage = () => {
            const canvas = canvasRef.current;
            if (!canvas) return; // Ensure canvas is available

            const dataURL = canvas.toDataURL('image/png');

            // Create a link element
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'edited_image.png'; // Set the default filename
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up the link element
            document.body.removeChild(link);
        };

        const handleOutlineColorChange = (event) => {
            setOutlineColor(event.target.value);
        };

        const handleOutlineThicknessChange = (event) => {
            setOutlineThickness(parseInt(event.target.value));
        };


        const handleTemplate1 = () => {
            // Set properties for template 1
            setText('Template 1 Text');
            setTextColor('white');
            setTextSize(20);
            setTextX(50);
            setTextY(50);
            setTextStyle('template1');
        };

        const handleTemplate2 = () => {
            // Set properties for template 2
            setText('Template 2 Text');
            setTextColor('black');
            setTextSize(25);
            setTextX(100);
            setTextY(100);
            // You can set other properties as needed
        };

        const handleTemplate3 = () => {
            // Set properties for template 3
            setText('Template 3 Text');
            setTextColor('red');
            setTextSize(30);
            setTextX(150);
            setTextY(150);
            // You can set other properties as needed
        };


        return (
            <Container fluid style={{ textAlign: 'left' }}>
                <header style={{ marginLeft: '20px' }}>
                    <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">
                    </link>
                    <h1 className={styles.left} style = {{fontFamily:'Arial'}}>Meme Editor</h1>
                </header>
                <div style={{ display: 'flex', marginLeft: '30px' }}>
                    <div style={{ marginBottom: '10px', marginLeft: '-10px'  }}>
                    <button  onClick={togglePopup} style = {{marginRight: '30px'}}>Select Image</button>
                    <button  onClick={handleTemplate1} style = {{marginRight: '30px'}}>Template 1</button>
                    <button  onClick={handleTemplate2} style = {{marginRight: '30px'}}>Template 2</button>
                    <button  onClick={handleTemplate3} style = {{marginRight: '30px'}}>Template 3</button>
                    </div>
                </div>
                <div>   
                {selectedImage && (
                    <>
                    <h2 style = {{fontFamily:'Arial', marginBottom: '10px', marginLeft: '1000px' }} >Canvas</h2>
                    <button onClick={toggleColorPopup}>Change Canvas Color</button>
                    {showColorPopup && (
                        <div className="popup">
                            <label htmlFor="canvasColor">Canvas Color:</label>
                            <input
                                type="color"
                                value={tempCanvasColor}
                                onChange={(e) => setTempCanvasColor(e.target.value)}
                            />
                        <button onClick={confirmCanvasColorChange}>Confirm Color</button>
                        </div>
                    )}
                    <canvas ref={canvasRef} style={{ width: '700px', height: '700px', marginTop: '10px' }} />
                    {selectedImage && (
                        <>
                            <div style = {{textAlign: 'left', marginLeft: '1000px', marginTop: '-700px'}}>
                                <h2 style = {{fontFamily:'Arial'}} >Image Size</h2>
                                <select value={imageSizeOption} onChange={(e) => setImageSizeOption(e.target.value)}>
                                    <option value="cover">Cover (100%)</option>
                                    <option value="eightyPercent">80% of Canvas</option>
                                </select>
                                <h2 style = {{fontFamily:'Arial'}}>Add/Edit Text</h2>
                                <label htmlFor="textInput">Text:</label>
                                <input type="text" value={text} onChange={handleTextChange} />
                                <br />
                                <label htmlFor="fontFamilyInput">Font Family:</label>
                                <select id="fontFamilyInput" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                                    <option value="Arial">Arial</option>
                                    <option value="Verdana">Verdana</option>
                                    <option value="Times New Roman">Times New Roman</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Courier New">Courier New</option>
                                    <option value="Anton">Anton</option>
                                </select>
                                <label htmlFor="textColorInput">Text Color:</label>
                                <input type="color" value={textColor} onChange={handleTextColorChange} />
                                <br />
                                <label htmlFor="textSizeInput">Text Size:</label>
                                <input type="number" value={textSize} onChange={handleTextSizeChange} />
                                <br />
                                <label htmlFor="textXInput">Text X Position:</label>
                                <input type="number" value={textX} onChange={handleTextXChange} />
                                <br />
                                <label htmlFor="textYInput">Text Y Position:</label>
                                <input type="number" value={textY} onChange={handleTextYChange} />
                                <br />
                                <label htmlFor="outlineColorInput">Outline Color:</label>
                                <input type="color" value={outlineColor} onChange={handleOutlineColorChange} />
                                <br />
                                <label htmlFor="outlineThicknessInput">Outline Thickness:</label>
                                <input type="number" value={outlineThickness} onChange={handleOutlineThicknessChange} />
                                <br />
                                <button onClick={() => setText('')}>Clear Text</button> 
                                <button onClick={handleSaveImage}>Save Image</button>
                            </div>
                            </>
                    )}; 
                    </>
                )}; 
                </div>
                {showPopup && (
                            <div className="popup">
                                <input type="file" accept="image/*" onChange={handleImageSelect} />
                                <input type="text" placeholder="Enter Image URL" value={imageUrl} onChange={handleImageUrlChange} />
                                <button onClick={handleAddImageUrl}>Add Image</button>
                            </div>
                )};   
            </Container>
        );
    };

    export default EditorPage;





    {/*
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

*/}
