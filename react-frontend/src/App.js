import logo from './logo.svg';
import './App.css';

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
  

function App() {

  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;



