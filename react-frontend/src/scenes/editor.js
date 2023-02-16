import React, { useState, createRef } from "react";
import { useSearchParams } from "react-router-dom";
import { exportComponentAsJPEG } from 'react-component-export-image';
import Text from "../components/text";
import Button from 'react-bootstrap/Button';

//Editor where we can create new memes (TODO: Improve the style of the memes to make it more adaptable and flexible based on the source-image)
export default function Editor () {
    const [parameters] = useSearchParams();
    const [counter, setCounter] = useState(0);
    const inputText = () =>{ setCounter(counter + 1)};
    const memeRef = createRef();

    return ( 
        <>
            <h1> Editor </h1>
            <div style = {{width: " 250px", height: " 250px", border: '1px solid'}} ref = {memeRef} className = "meme mt-5 mb-5">
                <img src={parameters.get("url")} width = "250px"/>
                { Array(counter).fill(0).map(e => <Text />) }
            </div>
            <Button onClick={inputText}> Add Text </Button> 
            <Button variant="success" onClick={(e) => exportComponentAsJPEG(memeRef)}> Save </Button>     
        </>
    );  
};