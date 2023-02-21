import React, { useState, createRef } from "react";
import { useLocation } from "react-router-dom";
import Text from "../components/text";
import Button from 'react-bootstrap/Button';

// Editor component to create new memes
export default function Editor() {
    const [counter, setCounter] = useState(0);
    const inputText = () =>{ setCounter(counter + 1)};
    const memeRef = createRef();
    const location = useLocation();
    const imageUrl = decodeURIComponent(new URLSearchParams(location.search).get("url"));

    return ( 
        <>
            <h1> Editor </h1>
            <div style = {{width: " 250px", height: " 250px", border: '1px solid'}} ref = {memeRef} className = "meme mt-5 mb-5">
                <img src={imageUrl} width = "250px"/>
                { Array(counter).fill(0).map(e => <Text />) }
            </div>
                 
            <Button onClick={inputText}> Add Text </Button>      
        </>
    );  
};
