import Create from "./scenes/create";
import Home from "./scenes/home";
import Discover from "./scenes/discover";
import Profile from "./scenes/profile";
import Navbar from "./scenes/navbar";
import Editor from "./scenes/editor";
import {Route, Routes} from "react-router-dom";

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
  

function App() {

  
  return (
  <>
  <div className="background">
  <Navbar />
  <div className="container">
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/discover" element={<Discover />}/>
      <Route path="/create" element={<Create />}/>
      <Route path="/profile" element={<Profile />}/>
      <Route path="/editor" element={<Editor/>}/>
    </Routes>
    </div>
    </div>
  </>)
}

export default App;



