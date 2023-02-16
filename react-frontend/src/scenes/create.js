import React, { useEffect, useState } from "react";
import Meme from "../components/meme";
import { getAllMemes } from '../api/memes';


export default function Create () {
    const[data, setData] = useState([]);

    //Gather all memes from the used API
    useEffect(() => {
        getAllMemes().then(memes => setData(memes.data.memes));
    }, [])

    return ( 
        <>
            <h1> Create </h1>
            <div className = "row">
                {data.map(el => (<Meme img={el.url} title={el.name} />))}  
            </div>         
        </>
    );
};