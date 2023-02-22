import React, { useState, createRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Text from "../components/text";
import Button from 'react-bootstrap/Button';

// Editor component to create new memes
export default function Editor() {
  const [counter, setCounter] = useState(0);
  const [resetCounter, setResetCounter] = useState(0); // new state variable for reset button
  const memeRef = createRef();
  const [imageUrl, setImageUrl] = useState("");

  const location = useLocation();

  useEffect(() => {
    const url = decodeURIComponent(new URLSearchParams(location.search).get("url"));
    setImageUrl(url);
  }, [location]);

  return (
    <>
      <h1>Editor</h1>
      <div style={{ width: "250px", height: "250px", border: '1px solid' }} ref={memeRef} className="meme mt-5 mb-5">
        <img src={imageUrl} alt="Meme" style={{ width: "100%", height: "100%" }} />
        {Array(counter).fill(0).map(e => <Text key={e} />)}
      </div>

      <Button onClick={() => setCounter(counter + 1)}>Add Text</Button>
      <Button onClick={() => setResetCounter(resetCounter + 1)}>Clear</Button>
    </>
  );
};
