import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Button from "../components/button";
import Input from "../components/input";

const style = {
    border:"3px solid green",
    margin: 20,
    padding: 20,
    whiteSpace: "pre-line",
}


const Profile =() =>{
    // Should we create a post component so everything doesn't change at once?
    //like button function
    //need to set usestate of 'like' to the # of the specific post
    const [like, setLike] = useState(456),
    [isLike, setIsLike] = useState(false),
    
    // function for when the like button is clicked
    onLikeButtonClick = () => {
        setLike(like + (isLike ? -1 : 1));
        setIsLike (!isLike);
        if (isDislike){setDislike (dislike - 1); setIsDislike(!isDislike)};
    }

    const [dislike, setDislike] = useState(12),
    [isDislike, setIsDislike] = useState(false),
    
    onDislikeButtonClick = () => {
        setDislike(dislike + (isDislike ? -1 : 1));
        setIsDislike (!isDislike);
        if (isLike){setLike (like - 1); setIsLike(!isLike)};
    }
    
    const [comExp, setComExp] = useState(false),
    onCommentButtonClick = () => {
        setComExp (!comExp);
    }
    
    //Add in the data source from the posts here
    const [dataSource, setDataSource] = useState(Array.from({length:10}))
    const [hasMore, setHasMore] = useState(true)
    const fetchMoreData = () =>{
        // checking the length of the data, if it is more than all of the data then set has more to false
        if(dataSource.length <100){
        //MAKING API CALL
        setTimeout(()=> {
            setDataSource(dataSource.concat(Array.from({length:10})))
        },1000);
        }else{
            setHasMore(false);
        }
    }
    return <><h1>Wow look at these memes :o</h1><InfiniteScroll 
        dataLength={dataSource.length} 
        next={fetchMoreData} 
        hasMore={hasMore}
        loader={<p>Fetching more memes...</p>}
        endMessage={<p>That's all there is to discover! Go make your own meme now :p</p>}>

        {dataSource.map((item,index)=>{
            return( 
            <div style={style}>
                This is post #{index+1} inside the infinite scroll
                
                <div class = 'parent'
                style= {{
                    display: "flex",
                    justifyContent: "right",
                    gap: "30px",
                }}>
                <div class ='child'
                style= {{
                    display: "inline-block",
                    gap: "15px",
                }}>
                <Button 
                    variant = {isLike? "liked":"like"}
                    onClick = {onLikeButtonClick}
                    >
                        ▲ {like}
                    </Button>
                <Button                    
                    variant = {isDislike? "disliked":"dislike"}
                    onClick = {onDislikeButtonClick}
                    >
                        ▼ {dislike}
                    </Button>
                </div>
                <div class = 'child'
                style= {{
                    display: "inline-block",
                    alignItems: "right",
                    justifyContent: "right",
                    gap: "10px",
                }}>
                <Button
                //if(comExp)  
                // bool for whether comment button is changed, if yes, expand just like for likes and dislikes
                    variant ={comExp? "dark":"light"}
                    onClick = {onCommentButtonClick}
                    >
                        Comments
                 </Button>  
                </div>
                </div>
                <div style= {{
                    display: "flex",
                    justifyContent: "left",
                    gap: "20px",
                }}>
                
                {comExp? 
                <Input
                placeholder="Type your comment here..."/>
                :""}
                
                </div>            
            </div>
            );
        })}

    </InfiniteScroll></>
}

export default Profile;