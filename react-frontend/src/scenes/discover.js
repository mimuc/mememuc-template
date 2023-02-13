import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../components/post";
const PostCall = require ("../callback/callback_post")

const style = {
    border:"3px solid green",
    margin: 20,
    padding: 20,
    height: "100%",
    backgroundColor: 'white',
    whiteSpace: "pre-line",
}


const Discover =() =>{
    //Add in the data source from the posts here
    const [posts, setPost] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const fetchMoreData = () =>{
        // checking the length of the data, if it is more than all of the data then set has more to false
        if(posts.length <40){
        //MAKING API CALL
        setTimeout(()=> {
            
        },1000);
        }else{
            setHasMore(false);
        }
    }
    // Need to replace infinite scroll with list of posts. One post example from the por=st component is at the top
    return <>
    <p>Wow look at these memes :o</p>
    <Post></Post>
    <InfiniteScroll 
        dataLength={dataSource.length} 
        next={fetchMoreData} 
        hasMore={hasMore}
        loader={<p>Fetching more memes...</p>}
        endMessage={<p>That's all there is to discover! Go make your own meme now :p</p>}>


        {dataSource.map((item,index)=>{
            return( 
            <div style={style}>
                This is post #{index+1} inside the infinite scroll
            </div>
            );
        })}

    </InfiniteScroll>

    </>
}

export default Discover;