import './App.css';
import LandingPage from './Pages/MainPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import ViewPage from './Pages/View/ViewPage';
import EditorPage from './Pages/Editor/EditorPage';
import ProfilePage from './Pages/Profile/ProfilePage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/memes" element={<ViewPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
