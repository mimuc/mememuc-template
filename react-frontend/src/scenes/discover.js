import React, { useState ,useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../components/post";
import getPosts from "../callback/callback_post";
const localserver = "http://localhost:3001";

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
    const isMounted = useRef(false);

    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [counter, setCounter] = useState(0);

    const fetchData = async () => {
      console.log("Fetching more data...");
      await setIsLoading(true);
      //console.log("counter"+counter);
      await fetch(`${localserver}/posts/get40` + "?counter="+counter)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not OK');
          }
          //console.log("the response is "+response.json());
          return response.json();
        })
        .then( (data) => {
          
            
            data.forEach(element => {
              console.log(JSON.stringify(element._id));
            });
          
          
          if(data.length !==0){
            console.log("the data length indiscover is :"+data.length);
            setCounter(counter + data.length);
            console.log("counter legnth is "+counter);
            setPosts(precedent => [...precedent,...data]);
           setIsLoading(false);
         
            }else{
                setHasMore(false);
            }
          
        })
        .catch((error) => console.log(error));
    };

    

    useEffect(() => {
      if (isMounted.current == false){
      console.log("welcome to discover!");
      console.log("ismounted:" +isMounted.current);
      console.log("welcome to useeffect");
        
      
      fetchData();
      isMounted.current = true;
      }else{
        
        console.log("discover already mounted");
      }
      return ;

    }
      , []);

      
    
    
    return (<>
    <p>Wow look at these memes :o</p>
    
    
    {
    <InfiniteScroll 
        dataLength={posts.length} 
        next={fetchData} 
        hasMore={hasMore}
        loader={<p>Fetching more memes...</p>}
        endMessage={<p>That's all there is to discover! Go make your own meme now :p</p>}>

         
        {posts.map((item,index)=>{
            
            return( 
            <Post key={item._id} likes= {item.n_likes} dislikes = {item.n_dislikes} image={item.image} id={item._id} comments={item.comments} user_id={item.user_id}>
                This is post #{index+1} inside the infinite scroll
            </Post>
            );
        })}

    </InfiniteScroll>
      }
    </>)
}

export default Discover;