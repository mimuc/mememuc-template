const localserv = "http:/localhost:27017"

async function commentPost(post_id,user_id, text ) {
    try {
        
        
      const res = await fetch(localserv+`/posts/create?post_id=${post_id}&user_id=${user_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:{
        text: text,
        

      }
    });
  
    }
    catch(error){
      console.error(error);
    }
  }

  module.exports = {commentPost};