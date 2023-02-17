import * as React from 'react';
import { useNavigate } from "react-router-dom";

interface MemeBoxProps {
    meme: any
}

const MemeBox: React.FC = (props: { meme: any, callback: any }) => {

    return (
        <div className="meme-box" onClick={() => props.callback(props.meme)}>
            <img className="meme-box-img" src={props.meme.image} alt={"oh no kein bild"}/>
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