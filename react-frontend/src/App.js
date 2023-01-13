import logo from './logo.svg';
import './App.css';
import SignIn from './components/login/login.tsx';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import MemePage from './components/memePage/memePage.tsx';
import ProfilePage from './components/profile/profilePage.tsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn></SignIn>}></Route>
        <Route path="/memePage" element={<MemePage></MemePage>}></Route>
        <Route path="/profile" element={<ProfilePage/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
