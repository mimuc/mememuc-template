import Create from "./scenes/create";
import Home from "./scenes/home";
import Discover from "./scenes/discover";
import Profile from "./scenes/profile";
import Navbar from "./scenes/navbar";
import {Route, Routes} from "react-router-dom";

const localserv = "http:/localhost:27017"




  

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
    </Routes>
    </div>
    </div>
  </>)
}

export default App;



