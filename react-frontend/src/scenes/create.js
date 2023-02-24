import React, { useState, useEffect } from "react";
import Meme from "../components/meme";
import { getAllMemes } from '../api/memes';
import { useNavigate } from "react-router-dom";
import Button from "../components/button";

export default function Create(props) {
  const [data, setData] = useState([]);
  const [upload, setUpload] = useState(null);
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  // Get all memes from the used API
  useEffect(() => {
    getAllMemes().then(memes => setData(memes.data.memes));
}, [])

  const imageUpload = (e) => {
    const file = e.target.files[0];
    setUpload(file);
  };

  const imageUrlChange = (e) => {
    setUrl(e.target.value);
  }

  const imageCreate = (e) => {
    e.preventDefault();
    if (upload) {
      const formData = new FormData();
      formData.append('file', upload);
      const url = URL.createObjectURL(upload);
      navigate(`/editor?url=${encodeURIComponent(url)}`);
    } else if (url) {
      navigate(`/editor?url=${encodeURIComponent(url)}`);
    }
  }

  const imagePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURI = canvas.toDataURL('image/png');
        setUrl(dataURI);
        stream.getTracks().forEach(track => track.stop());
      };
      video.play();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1> Create </h1>
      <div>
        <form onSubmit={imageCreate}>
          <input type="file" accept="image/*" onChange={imageUpload} />
          <Button type="submit" variant="primary" disabled={!upload}>Create</Button>
          <input type="text" placeholder="Take your Picture" value={url} onChange={imageUrlChange} />
          <Button onClick={imagePhoto}>Take your Picture</Button>
          <Button type="submit" variant="primary" disabled={!url}>Create</Button>
        </form>
      </div>
      <div className="grid-container">
        {data.map(el => (<Meme img={el.url} title={el.name} width={el.width} height={el.height} />))}
      </div>
    </>
  );
};
