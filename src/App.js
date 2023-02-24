import { BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css';
import Home from "./pages/Home";
import Register from "./pages/Register";
import Image from "./pages/Image"
import NavBar from "./components/NavBar";
import Users from "./pages/Users";
import Album from "./pages/Album";
import Login from "./components/Login";
import Sign from "./components/Sign"
import AuthDetail from "./components/AuthDetail";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign" element={<Sign />} />
          <Route path="/authDetails" element={<AuthDetail />} />
          <Route path="/album" element={<Album />} />
          <Route path="/users" element={<Users />} />
          <Route path="/add" element={<Register />} />
          <Route path="/addImage" element={<Image />} />
          <Route path="/update/:id" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
