// Component for one post - include post id
import React, { useState } from "react";
import Button from "../components/button";
import Input from "../components/input";

const Like = require ("../callback/callback_like");
const Comment = require ("../callback/callback_comment");


const style = {
    //border: "4px solid #9CC694",
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '#A0BB9D 0px 5px 5px 3px ',
    whiteSpace: "pre-line",
}

const stylecom = {
    backgroundColor: '#EFEFEF',
    width: '100%',
    marginBottom: '2px',
    marginTop: '5px',
    marginLeft: '3px',
    padding: '5px',
    fontSize: '13px',
    textAlign: 'left',
    color: '#565656',
  };

const PostComponent = ( type, variant, className, post_id = "hfsdjefwf123", onClick, size, children,user_id ) => {
    //like button function
    //need to set like usestate from 456 to the number of likes specific to the post ID
    const [like, setLike] = useState(456),
        [isLike, setIsLike] = useState(false),

        onLikeButtonClick = () => {
            setLike(like + (isLike ? -1 : 1));
            setIsLike(!isLike);
            if(!isLike){
            Like.like_post(post_id,user_id,"like")
            }
            if (isDislike) { 
                setDislike(dislike - 1); 
                setIsDislike(!isDislike) 
            };
        }

    //dislike button function
    //need to set dislike usestate from 12 to the number of dislikes specific to the post ID
    const [dislike, setDislike] = useState(12),
        [isDislike, setIsDislike] = useState(false),

        onDislikeButtonClick = () => {
            setDislike(dislike + (isDislike ? -1 : 1));
            setIsDislike(!isDislike);
            if(!isDislike){
                Like.like_post(id,user_id,"like")
                }
            if (isLike) { setLike(like - 1); setIsLike(!isLike) };
        }

    //comment button function - changes the state between true and false when comment button is clicked to trigger expansion of comments section
    // number/list of comments could be set here but functionality not yet implemented
    const [listCom, setListCom] = useState(["Wow cool meme!", "Love it"]),
        [newinpt, setNewinpt] = useState(""),
        [comExp, setComExp] = useState(false),
        onCommentButtonClick = () => {
            setComExp(!comExp);
        }

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(newinpt);
        Comment.comment_post(post_id,user_id,newinpt);
        setListCom((ls)=> [...ls,newinpt]);
        setNewinpt("");
    }

    //Here is the format of the post component, replace username and description with the corresponding one from the post ID
    return (
        <div style={style}>
            <div className ="username"
            style={{
                display: "flex",
                alignItems: "left",
                justifyContent: "left",
            }}>
                Username</div>
            <div className = "postdescr">This is the description of the meme!</div>
            <br></br>
            <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <div class="square">
                <p>Meme pic here</p>
            </div>
            </div>
            <br></br>
            <div className ='parent'
                style={{
                    display: "flex",
                    justifyContent: "right",
                    gap: "30px",
                }}>
                <div className ='child'
                    style={{
                        display: "inline-block",
                        gap: "15px",
                    }}>
                    <Button
                        variant={isLike ? "liked" : "like"}
                        onClick={onLikeButtonClick}
                    >
                        ▲ {like}
                    </Button>
                    <Button
                        variant={isDislike ? "disliked" : "dislike"}
                        onClick={onDislikeButtonClick}
                    >
                        ▼ {dislike}
                    </Button>
                </div>
                <div className ='child'
                    style={{
                        display: "inline-block",
                        alignItems: "right",
                        justifyContent: "right",
                        gap: "10px",
                    }}>
                    <Button
                        //if(comExp)  
                        // bool for whether comment button is changed, if yes, expand just like for likes and dislikes
                        variant={comExp ? "dark" : "light"}
                        onClick={onCommentButtonClick}
                    >
                        Comments
                    </Button>
                </div>
            </div>
            <div>
                {comExp ?
  
                        <form onSubmit = {handleSubmit}>
                            <Input
                            placeholder="Type your comment here and press enter to post..." 
                            newinpt="newinpt" 
                            value={newinpt}
                            onChange = {(e) => setNewinpt(e.target.value)}/>
                        </form>
                                                                                               
                    : ""}
                
            </div>

                {comExp ?
                    <div>
                        {listCom.map(newinpt => 
                        <div 
                        key={newinpt} 
                        style={stylecom}>
                            {newinpt}
                        </div>)}
                    </div>                                                                               
                : ""}
           

            
        </div>
    );
}

const Post = ({ type, variant, className, id, onClick, size, children, user_id }) => {
    return <PostComponent
        type={type ? type : "post"}
        variant={variant}
        className={className ? `post-comp ${className}` : "post-comp"}
        id={id}
        onClick={onClick}
        size={size}
    >
        {children}
    </PostComponent >

};

export default Post;