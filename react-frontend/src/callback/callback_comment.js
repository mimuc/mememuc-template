const localserv = "http:/localhost:27017"

async function comment_post(post_id,user_id, text ) {
    try {
        const now = new Date();
        const dateString = now.toISOString();
      const res = await fetch(localserv+`/posts/create?post_id=${post_id}&user_id=${user_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:{
        text: text,
        date : dateString

      }
    });
  
    }
    catch(error){
      console.error(error);
    }
  }

  module.exports = {comment_post};