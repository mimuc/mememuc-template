const localserv = "http://localhost:3001"

//when you like the post, you need to remove the dislike if the user disliked the post 

async function like_post(post_id,user_id,genre) {
    try {
      console.log(`the post ${post_id} is liked by ${user_id}`);
      const res = await fetch(localserv+`/likes/create?user_id=${user_id}&post_id=${post_id}&genre=${genre}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    }
    catch(error){
      console.error(error);
    }
  }

  module.exports = {like_post};