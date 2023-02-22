import React, { useState, createRef } from "react";
import { useLocation } from "react-router-dom";
import Text from "../components/text";
import Button from 'react-bootstrap/Button';

// Editor component to create new memes
export default function Editor() {
    const [counter, setCounter] = useState(0);
    const [resetCounter, setResetCounter] = useState(0); // new state variable for reset button
    const memeRef = createRef();

    const location = useLocation();
    const imageUrl = decodeURIComponent(new URLSearchParams(location.search).get("url"));

    const handleReset = () => {
        setResetCounter(resetCounter + 1); // increment resetCounter to trigger re-render
        setCounter(0); // reset counter to clear all text elements
    };

    return ( 
        <>
            <h1> Editor </h1>
            <div style={{width: "250px", height: "250px", border: '1px solid'}} ref={memeRef} className="meme mt-5 mb-5">
                <img src={imageUrl} width="250px" alt="Meme"/>
                { Array(counter).fill(0).map(e => <Text key={e} />) }
            </div>
                 
            <Button onClick={() => setCounter(counter + 1)}> Add Text </Button> 
            <Button onClick={handleReset}> Clear </Button> {/* new "clear" button */}
        </>
    );  
};
