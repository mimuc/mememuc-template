import React, { useState ,useEffect} from "react";
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
    

    const [posts, setPosts] = useState([{image:"iVBORw0KGgoAAAANSUhEUgAAAHUAAAAnCAYAAAAxQgdAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAUlSURBVHhe7ZrbaxxVHMe/c9vJbXNrksaaKxqoEGOsSqhVk2oMRFErCAoVBMEH9UHwUf8EfYtPCvogFkKR+lBbS6toK2jq1pYGattoYhMak22ay8ZcdmdnxvM7s7OJwdY5uzrW4Xzg7Gxmdr7n8j2/c87MieIyIIkUau4oiRDS1AgiTY0g0tQIIk2NINLUCCJNjSDS1AgSyssHPwtFUfLfJTfHbys6iiLfKEWQ/yRSsxkbjlNctqpGWky7SB1NV+DYLtcqBoVNZFQ/0ioG0jFiejiRyqpNH/nMNhPkHJmoaSrOj17Ap0cPobqugjeASJF9NTJ0eX4NhqGhpCLGtQvRUVQFqblVlDINo0TnHUS0CUlLZTrpNQuZtSzitaXC5SG4DqtXan4FT+4dxP333Qvbtlmbad4PBCgsUtkd3GSelBua6uM4Dq+orms4dWoEJ698jrsfbkN61eINGxTKg7IpKTNw9vgEqreXo7WzHtZ6VliHiq6bGhKHf0FbVwPqmuPIWvafyh0E6ghGiYbpsQUkJ5bQPdAuXB6CdExWr4unp7Crtg/9j/Uiy0zVCzA18OqXTPQalbUGKy9VXmFjxWZDvXMbJvO2Yx/+OUJTVZimCTNWZCKNiOr40em3mSjCjzSU0XJmEYfHP8TBy0OYTI1xk8m8kd+O4cDFd3AueZKfYzHK79mKF7ky3SjlyQWLKEKmetHnokQrQyp9HUfG38dXU8PsgoLplQkc+vk9nJk5gfJYNRvXKVo37tmMH7ky/XXKs/m7AIFNZdnxDMkgQ4vh8db9aK/qwvm5bzA69x2+vfoZltJJDLa/jI7qLhaj1ONYofxyFdbpJAUgNKd6vYgt210H9WU70N+yH7aTZRE6hNMzX2Bn7W7s3vGEF5mUFBcqm3dVNo+67LskHIQilczivnLPHDzQ2I/uuj7MrIxDUzQMtL6IciPOr6mqxg39NfUTZlem2HXh6VtSIAW1NB+G2ZGMNDSTG04rYdu1ctdVLKxfw5eTB/HB6Fu4MD8ivMSXFE7w4ZdHqf+o4g2rPya/xpnZE6gyG7CeXcXxKwfwu5Xi0Uwr5GurU7DsTD7KJeEQPFKZUb4xNEfOryeZiZ/weXPfna+ju6EPlxd+wPfTR/iPW+IdeGHnm7itvA2Ww4zl47YkDILPqfwRxYvWLFsckaFjiwl01+9FT+MAHrn9WZTplTg68REuzZ/lCyvLsfiiihsqAzU0gg+/OVfIoCQbVmfZc2nntj14tPl5fq29qhO9Tc+h0qzBpYUEN5Ote1kHIGNtufoNEaHh159Tt5c147Xud/HGriE0V3bwyzTHPnXHK3i752MMtr3E/6a5tCV+F2rMRh7peZi/NJIXk245HUp02HJeNPk6HH5CHKHhl0ylpKk6dDXGj/6QzH/Djrpq8JcT/m/3dbyKe+ofYs+z3usv/hpMdaEZ7FBgontdermh3To6pEFa/4SO/6rQzbWrKP/a1htB5wm6ZDvejkMicQ7Dx4bR0FQDW3BXxM9D01XMXV2GWaqjgra6srl5OyC+Dm11JSdTqGQaZoUBl7YCBXQI0iKdlVQa6ykL25ricGyx8hCkoxka5qYX8XTvM9jzYE/IW29/A0lSpbZK07l0JoOF60ve5rZYvTdgt5KxpM83pYvUoW3BYstDe6r0LG6zDlaMDmnU1Fby3Rq/HUUJ5T8fJOESiql+Fn70yn50c6id/LaSkSrhBH+kkfxvkKZGEGlqBJGmRhBpagSRpkYQaWrkAP4AShO/TSM0N0cAAAAASUVORK5CYII="}]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false)

    console.log("welcome to discover!")

    useEffect(() => {
        console.log("welcome to useeffect");
        setIsLoading(true);
        const fetchData = async () => {
        console.log(`${localserver}/post/get40`);
        await fetch(`${localserver}/post/get40`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not OK');
            }
            return response.json();
          })
          .then((data) => {
            setPosts(data);
            setIsLoading(false);
            console.log("the data fetched"+data);
          })
          .catch((error) => console.log(error));
      };
      fetchData();
    }
      , []);
    /*
      useEffect(() => {
        console.log("entering the useefffect");
        const fetchData = async () => {
          await setIsLoading(true);
          const data = await getPosts();
          setPosts(data);
          console.log("look at the data"+data)
          console.log("the data has been fetched, here is the image :"+posts[0])
          await setIsLoading(false);
        };
        fetchData();
      }, []);*/
    const fetchMoreData = () =>{/*
        // checking the length of the data, if it is more than all of the data then set has more to false
        if(posts.length <40){
        //MAKING API CALL
        setTimeout(()=> {
            const newPost = getPosts();
            console.log(newPost[0])
            if(newPost.length !==0){
            setPosts(precedent => [...precedent,...newPost]);
            }else{
                setHasMore(false);
            }
        },2000);
        }else{
            setHasMore(false);
        }*/

        console.log("welcome to getmoredata");
        setIsLoading(true);
        const fetchData = async () => {
        await fetch(`${localserver}/post/get40`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not OK');
            }
            return response.json();
          })
          .then((data) => {
            setPosts(precedent => [...precedent,...data]);
            setIsLoading(false);
            console.log("the data fetched"+data);
          })
          .catch((error) => console.log(error));
      };
      fetchData();
    }
    // Need to replace infinite scroll with list of posts. One post example from the por=st component is at the top
    return (<>
    <p>Wow look at these memes :o</p>
    
    {posts.length > 0 && <Post image={posts[0].image} />}
    
    <InfiniteScroll 
        dataLength={posts.length} 
        next={fetchMoreData} 
        hasMore={hasMore}
        loader={<p>Fetching more memes...</p>}
        endMessage={<p>That's all there is to discover! Go make your own meme now :p</p>}>

         
        {posts.map((item,index)=>{
            return( 
            <Post key={index} image={item.image}>
                This is post #{index+1} inside the infinite scroll
            </Post>
            );
        })}

    </InfiniteScroll>

    </>)
}

export default Discover;