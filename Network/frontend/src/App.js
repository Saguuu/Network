import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Following from "./components/Following";
import Profile from "./components/Profile";

function App() {
    return (
        <Router>
            <div className="app">
              <AuthProvider>
                <Routes>
                  <Route path="/register" element={<Register />}></Route>
                  <Route path="/login" element={<Login />}></Route>
                  <Route path="/user/:userId" element={<Profile />}></Route>
                  <Route path="/following" element={<Following />}></Route>
                  <Route path="/" element={<Home />}></Route>
                </Routes>
              </AuthProvider>
            </div>
      </Router>
    );
}

export default App;
