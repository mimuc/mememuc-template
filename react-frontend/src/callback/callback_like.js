const localserv = "http:/localhost:27017"

async function like_post(post_id) {
    try {
    
      const res = await fetch(localserv+"/like/create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id:"",
        post_id:"",
        date:"",
        genre:""
      })
    });
  
    }
    catch(error){
      console.error(error);
    }
  }