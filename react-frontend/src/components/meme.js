import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./button";
import Card from 'react-bootstrap/Card';

// Here the meme card is created
export default function Meme (props) {
  const navigate = useNavigate();

  const memeStyle = {
    width: 'auto',
    height: '80%',
    maxHeight: '900px',
    objectFit: 'contain',
  };

  return (
    <Card style={{ width: '100%', height: '100%' }}>
      <Card.Img variant="top" src={props.img} style={memeStyle} />
      <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
        <Button onClick={(e) => navigate(`/editor?url=${props.img}`)}>Create</Button>
      </Card.Body>
    </Card>
  );
}
