const localserv = "http:/localhost:27017"


async function createUser(name ) {
    try {
        
      const res = await fetch(localserv+`/posts/create?user=${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    }
    catch(error){
      console.error(error);
    }
  }
