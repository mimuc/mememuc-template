import React, { useState, useEffect, createRef} from "react";
import { useLocation } from "react-router-dom";
import Text from "../components/text";
import { getAllMemes } from '../api/memes';
import Button from "../components/button";
import { exportComponentAsJPEG } from 'react-component-export-image';

// Editor component to create new memes
export default function Editor() {
  const [counter, setCounter] = useState(0);
  const [data, setData] = useState([]);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState([]);
  const memeRef = createRef();
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

  const templateSwitch = (increment) => {
    const currentIndex = data.findIndex((meme) => meme.url === imageUrl);
    const newIndex = (currentIndex + data.length + increment) % data.length;
    setTemplateIndex(newIndex);
    setCounter(0);
    setImageUrl(data[newIndex].url);
  }

  const backButton = () => {
    templateSwitch(-1);
  }

  const nextButton = () => {
    templateSwitch(1);
  }

  const clearButton = () => {
    setCounter(0);
    setText([]);
  }

  const manageAddText = () => {
    setCounter(counter + 1);
    setText([...text, ""]);
  }

  const textChange = (index, newText) => {
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
        {text.map((t, index) => <Text key={index} value={t} onChange={(newText) => textChange(index, newText)} />)}
      </div>
      <Button onClick={manageAddText}>Add Text</Button>
      <Button onClick={backButton}>Back</Button>
      <Button onClick={nextButton}>Next </Button>
      <Button onClick={clearButton}>Clear</Button>
      <Button variant="success" onClick={(e) => exportComponentAsJPEG(memeRef)}> Save </Button>  
    </>
  );
};
