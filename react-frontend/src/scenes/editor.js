import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Text from "../components/text";
import { getAllMemes } from '../api/memes';
import Button from "../components/button";
import html2canvas from 'html2canvas';
const localserver = "http://localhost:3001";

// Editor component to create new memes
export default function Editor() {
  const [counter, setCounter] = useState(0);
  const [data, setData] = useState([]);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const url = decodeURIComponent(new URLSearchParams(location.search).get("url"));
    setImageUrl(url);
    setText([]);
  }, [location]);

  // Get all memes from the used API
  useEffect(() => {
    getAllMemes().then(memes => setData(memes.data.memes));
  }, [])

  const handleTemplateChange = (increment) => {
    const currentIndex = data.findIndex((meme) => meme.url === imageUrl);
    const newIndex = (currentIndex + data.length + increment) % data.length;
    setTemplateIndex(newIndex);
    setCounter(0);
    setImageUrl(data[newIndex].url);
  }

  const handlePreviousTemplate = () => {
    handleTemplateChange(-1);
  }

  const handleNextTemplate = () => {
    handleTemplateChange(1);
  }

  const handleClear = () => {
    setCounter(0);
    setText([]);
  }

  const handleAddText = () => {
    setCounter(counter + 1);
    setText([...text, ""]);
  }

  const handleTextChange = (index, newText) => {
    const newTextArray = [...text];
    newTextArray[index] = newText;
    setText(newTextArray);
  }

    const createPost = async (data) => {
        await fetch(localserver+`/posts/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body:{
                user_id:localStorage.get("userId"),
                image: data
            }
          })
          .then ( res => res.json())

    }

  return (
    <>
      <h1>Editor</h1>
      <div className="meme mt-5 mb-5">
        <img src={imageUrl} alt="Meme" style={{ width: "25%", height: "25%"}} />
        {text.map((t, index) => <Text key={index} value={t} onChange={(newText) => handleTextChange(index, newText)} />)}
      </div>
      <Button onClick={handleAddText}>Add Text</Button>
      <Button onClick={handlePreviousTemplate}>Previous Template</Button>
      <Button onClick={handleNextTemplate}>Next Template</Button>
      <Button onClick={handleClear}>Clear</Button>
    </>
  );
};
