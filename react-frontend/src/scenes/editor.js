import React, { useState, createRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Text from "../components/text";
import Button from 'react-bootstrap/Button';
import { getAllMemes } from '../api/memes';

// Editor component to create new memes
export default function Editor() {
    const [counter, setCounter] = useState(0);
    const [images, setImages] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const inputText = () =>{ setCounter(counter + 1)};
    const memeRef = createRef();
    const location = useLocation();
    const imageUrl = decodeURIComponent(new URLSearchParams(location.search).get("url"));
    const [templateIndex, setTemplateIndex] = useState(0);
    const [templates, setTemplates] = useState([]);


    // Save state to local storage when user navigates away
    useEffect(() => {
        window.addEventListener("beforeunload", saveStateToLocalStorage);

        return () => {
            window.removeEventListener("beforeunload", saveStateToLocalStorage);
        };
    }, []);

    // Load state from local storage when component mounts
    useEffect(() => {
        const storedImages = JSON.parse(localStorage.getItem("images"));
        if (storedImages) {
            setImages(storedImages);
        }

        const storedCounter = JSON.parse(localStorage.getItem("counter"));
        if (storedCounter) {
            setCounter(storedCounter);
        }
    }, []);

    // Save state to local storage
    const saveStateToLocalStorage = () => {
        localStorage.setItem("images", JSON.stringify(images));
        localStorage.setItem("counter", JSON.stringify(counter));
    };


    const handleImageChange = (event) => {
        const files = event.target.files;
        const imageList = Array.from(files).map((file) => ({ 
            url: URL.createObjectURL(file), 
            x: 0, 
            y: 0 
        }));
        setImages((prevImages) => [...prevImages, ...imageList]);
    }
    
    const handleDragStart = (index, event) => {
        event.dataTransfer.setData("text/plain", index);
        setDragging(true);
        setDraggedIndex(index);
    
        // Add event listener to track the image position while dragging
        const image = event.target;
        image.addEventListener('mousemove', handleImageMove);
    }
    
    const handleImageMove = (event) => {
        if (dragging && draggedIndex !== null) {
            const x = event.clientX - memeRef.current.offsetLeft;
            const y = event.clientY - memeRef.current.offsetTop;
            setImages((prevImages) => {
                const updatedImages = [...prevImages];
                updatedImages[draggedIndex] = { ...updatedImages[draggedIndex], x, y };
                return updatedImages;
            });
        }
    }
    
    const handleDragOver = (event) => {
        event.preventDefault();
    }
    
    const handleDrop = (event) => {
        event.preventDefault();
        const index = event.dataTransfer.getData("text");
        const x = event.clientX - memeRef.current.offsetLeft;
        const y = event.clientY - memeRef.current.offsetTop;
        setImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages[index] = { ...updatedImages[index], x, y };
            return updatedImages;
        });
        setDragging(false);
        setDraggedIndex(null);
    
        // Remove event listener when dragging is finished
        const image = event.target;
        image.removeEventListener('mousemove', handleImageMove);
    }
    
    const renderImages = () => {
        if (images.length > 0) {
          return images.map((image, index) => (
            <img 
              key={`img_${index}`} 
              src={image.url} 
              width="100px"
              style={{ 
                position: 'absolute', 
                top: image.y, 
                left: image.x, 
                cursor: 'move',
                transition: dragging ? 'none' : 'all 0.2s ease-out',
                zIndex: 999 // Set a high z-index value
              }} 
              draggable={true}
              onDragStart={(event) => handleDragStart(index, event)}
            />
          ));
        }
      };
      

    useEffect(() => {
        getAllMemes().then(memes => {
          const resizedMemes = memes.data.memes.map(meme => {
            if (meme.height > 2000) {
              const ratio = 2000 / meme.height;
              return { ...meme, width: meme.width * ratio, height: meme.height * ratio };
            }
            return meme;
          });
          setTemplates(resizedMemes);
        });
      }, []);
      
      const handleNextTemplate = () => {
        setTemplateIndex((prevIndex) => (prevIndex === templates.length - 1 ? 0 : prevIndex + 1));
      };
      
      const handlePrevTemplate = () => {
        setTemplateIndex((prevIndex) => (prevIndex === 0 ? templates.length - 1 : prevIndex - 1));
      };

    return ( 
        <>
            <h1> Editor </h1>
            <div 
                style={{
                    position: 'relative',
                    width: '500px',
                    height: '500px',
                    border: '1px solid',
                    margin: '0 auto',
                    marginTop: '5rem',
                    marginBottom: '5rem'
                }}
                ref={memeRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <img src={templates[templateIndex]?.url} width="500px" />
                <img src={imageUrl} width = "250px"/>
                {Array(counter).fill(0).map(e => <Text />)}
                {renderImages()}
            </div>
            <div style={{ textAlign: 'center' }}>
                <Button onClick={inputText}> Add Text </Button>
                <Button onClick={handlePrevTemplate}>Previous Template</Button>
                <Button onClick={handleNextTemplate}>Next Template</Button>
                <Button onClick={() => { 
                     setCounter(0);  
                     setImages([]);
                    }}>Clear</Button>
            </div>
            <input type="file" onChange={handleImageChange} multiple />     
        </>
    );  
};
