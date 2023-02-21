import React, { useEffect, useState } from "react";
import Meme from "../components/meme";
import { getAllMemes } from '../api/memes';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gridTemplateRows: 'repeat(auto-fill, 200px)',
  gridGap: '5px',
  justifyContent: 'center',
  alignContent: 'center',
};

export default function Create () {
    const[data, setData] = useState([]);

    // Gather all memes from the used API
    useEffect(() => {
        getAllMemes().then(memes => setData(memes.data.memes));
    }, [])

    return ( 
        <>
            <h1> Create </h1>
            <div style={gridStyle}>
                {data.map(el => (<Meme img={el.url} title={el.name} />))}  
            </div>         
        </>
    );
};




