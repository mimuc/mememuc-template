const localserv = "http:/localhost:27017"


async function createUser(name ) {
    console.log("in the createUser");
    return await fetch(localserv+`/users/create?user=${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then ( res => res.json())
  }

  module.exports = {createUser};
