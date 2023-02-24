import axios from "axios";
const localserver = "http://localhost:3001"

// get the 40 most recent posts 
  async function getPosts(counter = 0) {
  try {
    /*
    console.log("hello");
    console.log("helloo2");
    const response = await fetch(localserver+`/posts/get40`);
    const data = response.body;
    console.log("the type is"+typeof(data))
    console.log("the data in the getPosts is:"+data);
    return response;*/
    await fetch(`${localserver}/post/get40`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not OK');
            }
            return response.json();
          })
          .catch((error) => console.log(error));

  }
  catch(error){
    console.error(error);
  }

 }
 export default getPosts;