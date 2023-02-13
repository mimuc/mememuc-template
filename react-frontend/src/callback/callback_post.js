const localserv = "http:/localhost:27017"

// get the 40 most recent posts 
  async function getPosts() {
  try {
    
    const response = await fetch (localserv+`/posts/get_40`);
    const data = await response.json();
    return data;

  }
  catch(error){
    console.error(error);
  }

 }