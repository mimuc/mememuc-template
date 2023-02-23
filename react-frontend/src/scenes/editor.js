import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Text from "../components/text";
import Button from 'react-bootstrap/Button';
import { getAllMemes } from '../api/memes';

// Editor component to create new memes
export default function Editor() {
  const [counter, setCounter] = useState(0);
  const [data, setData] = useState([]);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  const location = useLocation();

  useEffect(() => {
    const url = decodeURIComponent(new URLSearchParams(location.search).get("url"));
    setImageUrl(url);
  }, [location]);

  // Get all memes from the used API
  useEffect(() => {
    getAllMemes().then(memes => setData(memes.data.memes));
  }, [])

  const handleTemplateChange = (increment) => {
    const newIndex = (templateIndex + data.length + increment) % data.length;
    setTemplateIndex(newIndex);
    setCounter(0);
    setImageUrl(data[newIndex].url);
  }  

  return (
    <>
      <h1>Editor</h1>
      <div className="meme mt-5 mb-5">
        <img src={imageUrl} alt="Meme" style={{ width: "25%", height: "25%"}} />
        {Array(counter).fill(0).map(e => <Text key={e} />)}
      </div>
      <Button onClick={() => setCounter(counter + 1)}>Add Text</Button>
      <Button onClick={() => handleTemplateChange(-1)}>Previous Template</Button>
      <Button onClick={() => handleTemplateChange(1)}>Next Template</Button>
      <Button onClick={() => {setCounter(0);}}>Clear</Button>
    </>
  );
};
