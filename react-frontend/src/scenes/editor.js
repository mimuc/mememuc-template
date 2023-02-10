import React, {useState} from "react";
import Text from "../components/text";
import { useSearchParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';

//Efitor where we can create new memes
export default function Editor () {
    const [parameters] = useSearchParams();
    const [counter, setCounter] = useState(0);
    const inputText = () =>{ setCounter(counter + 1)};
    
    return ( 
        <>
            <h1> Editor </h1>
            <div>
                <img src={parameters.get("url")} width = "250px"/>
                { Array(counter).fill(0).map(e => <Text />) }
                <Button onClick={inputText}> Add Text </Button> 
            </div>
                 
        </>
    );  
};