import * as React from 'react';
import { useNavigate } from "react-router-dom";

interface MemeBoxProps {
    meme: any
}

const MemeBox: React.FC = (props: { meme: any, callback: any }) => {

    let image = new Image();
    image.src = props.meme.image;
    let height = image.height;
    let width = image.width;
    let imageCanvas = document.createElement('canvas');
    imageCanvas.height = height;
    imageCanvas.width = width;
    let imageCtx = imageCanvas.getContext('2d');
    imageCtx.drawImage(image, 0, 0);
    //console.log(this.props.text1);
    imageCtx.font = props.meme.text1Bold + " " + props.meme.text1Italic + " 48px Arial";
    // console.log(imageCtx.font);
    imageCtx.fillStyle = props.meme.text1Color;
    imageCtx.fillText(props.meme.text1, props.meme.text1XPos, props.meme.text1YPos);
    // console.log("Text 2 bold: " + this.props.text2Bold);
    imageCtx.font = props.meme.text2Bold + " " + props.meme.text2Italic + " 48px Arial";
    //console.log(imageCtx.font);
    imageCtx.fillStyle = props.meme.text2Color;
    imageCtx.fillText(props.meme.text2, props.meme.text2XPos, props.meme.text2YPos);
    // image.src = imageCanvas.toDataURL("image/png");
    //console.log("Height = " + height + " width = " + width);

    return (
        <div className="meme-box" onClick={() => props.callback(props.meme)}>
            <img className="meme-box-img" src={imageCanvas.toDataURL('image/png')} alt={"oh no kein bild"}/>
        </div>
    )
}

interface MemeSliderProps {
    src: string,
}

const MemeSlider: React.FC = (props: MemeSliderProps) => {
    const [memes, setMemes] = React.useState([]);
    const [firstTime, setFirstTime] = React.useState(true);
    const navigate = useNavigate();

    if(firstTime) {
        setFirstTime(false);
    }

    React.useEffect(() => {
        fetch('http://localhost:3001/createdMemes' + props.src, {
            credentials: "include",
            method: 'GET'
        }).then((res) => {
            console.log("Got answer");
            if (res.ok) return res.json();
            console.log("Something went wrong");
        }).then((res) => {
            console.log(res);
            setMemes(res);
        });
    }, [firstTime, props.src]);

    const onMemeClicked = (meme) => {
        console.log(`Meme ${meme.title} clicked`);
        navigate('/memePage', { state: { meme }});
    }

    return (
        <div className="vertical-scroll-gallery">
            {
                memes.map((currmeme, index) => <MemeBox key={index} meme={currmeme} callback={onMemeClicked.bind(this)}/>)
            }
        </div>
    )
}

export default MemeSlider;