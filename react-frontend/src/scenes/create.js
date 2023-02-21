import React, { useEffect, useState } from "react";
import Meme from "../components/meme";
import { getAllMemes } from '../api/memes';

// Create component to upload user's image and display existing memes
export default function Create() {
  const [data, setData] = useState([]);

  // Get all memes from the used API
  useEffect(() => {
    getAllMemes().then(memes => {
      const resizedMemes = memes.data.memes.map(meme => {
        if (meme.height > 2000) {
          const ratio = 2000 / meme.height;
          return { ...meme, width: meme.width * ratio, height: meme.height * ratio };
        }
        return meme;
      });
      setData(resizedMemes);
    });
  }, []);

  return (
    <>
      <h1> Create </h1>
      <div className="grid-container">
        {data.map(el => (<Meme img={el.url} title={el.name} width={el.width} height={el.height} />))}
      </div>
    </>
  );
};




