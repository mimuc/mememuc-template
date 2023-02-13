import * as React from 'react';

interface MemeBoxProps {
    meme: any
}

const MemeBox: React.FC = (props: MemeBoxProps) => {

    return (
        <div className="meme-box">
            <img className="meme-box-img" src={props.meme.img} alt={"oh no kein bild"}/>
        </div>
    )
}

interface MemeSliderProps {
    src: string,
}

const MemeSlider: React.FC = (props: MemeSliderProps) => {
    let memes = [
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
        {
            "img": "https://content.linkedin.com/content/dam/engineering/site-assets/images/blog/posts/2019/08/IsolationForest1.png",
        },
    ]

    return (
        <div className="vertical-scroll-gallery">
            {
                memes.map((currmeme, index) => <MemeBox key={index} meme={currmeme}/>)
            }
        </div>
    )
}

export default MemeSlider;