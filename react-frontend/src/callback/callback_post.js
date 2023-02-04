const localserv = "http:/localhost:27017"

// get the 40 most recent posts 
  async function getPosts() {
  try {
    
    const response = await fetch (localserv+`/get_40`);
    const data = await response.json();
    setResponse(data.title);

  }
  catch(error){
    console.error(error);
  }

 }