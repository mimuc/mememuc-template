import React, { useState, useEffect } from "react";
import Meme from "../components/meme";
import { getAllMemes } from '../api/memes';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

export default function Create(props) {
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  }

  const handleCreate = (e) => {
    e.preventDefault();
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      const url = URL.createObjectURL(image);
      navigate(`/editor?url=${encodeURIComponent(url)}`);
    } else if (imageUrl) {
      navigate(`/editor?url=${encodeURIComponent(imageUrl)}`);
    }
  }

  const handleCameraClick = async () => {
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
        setImageUrl(dataURI);
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
        <form onSubmit={handleCreate}>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <input type="text" placeholder="Enter image URL" value={imageUrl} onChange={handleImageUrlChange} />
          <Button type="submit" variant="primary" disabled={!image && !imageUrl}>Create</Button>
          <Button onClick={handleCameraClick}>Take a Picture</Button>
        </form>
      </div>
      <div className="grid-container">
        {data.map(el => (<Meme img={el.url} title={el.name} width={el.width} height={el.height} />))}
      </div>
    </>
  );
};
