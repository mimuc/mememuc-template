// Component for one post - include post id
import React, { useEffect, useState, useRef } from "react";
import Button from "../components/button";
import Input from "../components/input";
const localserver = "http://localhost:3001";
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

const PostComponent = ( props) => {
    //like button function
    //need to set like usestate from 456 to the number of likes specific to the post ID

    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("test");
    const isMounted = useRef(false);
    

    
    const fetchUsername = async () => {
        await setIsLoading(true);
        await fetch(`${localserver}/users` + "?user_id="+props.user_id)
          .then((response) => {
            /*if (!response.ok) {
              throw new Error('Network response was not OK');
            }*/
            return response.json();
          })
          .then((data) => {
            if(data.length !==0){
              setUsername(data.name);
              
            setIsLoading(false);
            
              }
            
          })
          .catch((error) => console.log(error));
      };
    const [like, setLike] = useState(props.likes),
        [isLike, setIsLike] = useState(false),

        onLikeButtonClick = () => {
            setLike(like + (isLike ? -1 : 1));
            setIsLike(!isLike);
            if(!isLike){
                console.log(`the post ${props.id} es like par ${props.user_id}`);
                
                Like.like_post(props.id,props.user_id,"like")
            }
            if (isDislike) { 
                setDislike(dislike - 1); 
                setIsDislike(!isDislike) 
            };
        }

    const getComment = (comment_id) => {
        
        
        return fetch(`${localserver}/comments/id` + "?comment_id="+comment_id)
        .then(
        
        (result) => {
            
           
           
            if (result){
            return result.json();
            }
        }
    ).then(data => {
        console.log("this is the comment you get"+JSON.stringify(data));
        return data.text;
    })
    .catch((error)=> {
        console.log(error);
        return error
    });


    }
    const fetchComments = async (comments) => {
        
        const commentIds = comments;
        comments.forEach(element => {
            console.log(" comment id in post component" + element)
        });
        const allComments = await Promise.all(commentIds.map(async item => {
            await setIsLoading(true);
            
            const mycomment = await getComment(item)
              .then((data) => {
                console.log("look at this data"+data);
                if(data.length !==0){
                    setComCounter(comCounter + 3);
                    console.log("data text is equal to"+data);
                    setListCom([...listCom,data]);
                  
                setIsLoading(false);
                
                  }
                
              })
              .catch((error) => console.log(error));
          
            return mycomment;
          }))

          return allComments;

    }
    //dislike button function
    //need to set dislike usestate from 12 to the number of dislikes specific to the post ID
    const [dislike, setDislike] = useState(props.dislikes),
        [isDislike, setIsDislike] = useState(false),

        onDislikeButtonClick = () => {
            setDislike(dislike + (isDislike ? -1 : 1));
            setIsDislike(!isDislike);
            if(!isDislike){
                console.log(`the post ${props.id} es like par ${props.user_id}`);
                Like.like_post(props.id,props.user_id,"dislike")
                }
            if (isLike) { setLike(like - 1); setIsLike(!isLike) };
        }

    //comment button function - changes the state between true and false when comment button is clicked to trigger expansion of comments section
    // number/list of comments could be set here but functionality not yet implemented
    const [listCom, setListCom] = useState([]),
        [newinpt, setNewinpt] = useState(""),
        [comCounter, setComCounter] = useState(0),
        [comExp, setComExp] = useState(false),
        onCommentButtonClick = () => {
            setComExp(!comExp);
        }

    const handleSubmit=(e)=>{
        e.preventDefault();
        
        Comment.comment_post(props.post_id,props.user_id,newinpt);
        setListCom((ls)=> [...ls,newinpt]);
        setNewinpt("");
    }

    useEffect(()=>{
        if (isMounted.current === false){
        const effect = async () => {
        await fetchUsername();
        if (props.comments != []){
        await fetchComments(props.comments);
        }
        console.log("comments props "+props.comments)
        
        //*await fetchComments(props.comments);**/
        }
        effect();
        isMounted.current = true;
    }else{
        console.log("component already mounted");
    }
    },[]
    
    )

    //Here is the format of the post component, replace username and description with the corresponding one from the post ID
    return (
        <div style={style}>
            <div className ="username"
            style={{
                display: "flex",
                alignItems: "left",
                justifyContent: "left",
            }}>
                {username}</div>
            <div className = "postdescr">{props.id}</div>
            <br></br>
            <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <div className="square">
            <img src={`data:image/jpeg;base64,${props.image}`} alt=""/>
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

const Post = ({ image,type, variant, className, id, onClick, size, children, user_id, comments,likes,dislikes }) => {
    
    
    return <PostComponent
        type={type ? type : "post"}
        variant={variant}
        className={className ? `post-comp ${className}` : "post-comp"}
        id={id}
        onClick={onClick}
        size={size}
        user_id={user_id}
        image = {image}
        comments = {comments}
        likes = {likes}
        dislikes = {dislikes}
    >
        {children}
    </PostComponent >

};

export default Post;