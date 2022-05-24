import Home from "./components/Home";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Following from "./components/Following";

function App() {
    return (
        <Router>
            <div className="app">
              <AuthProvider>
                <Routes>
                  <Route path="/login" element={<Login />}></Route>
                  <Route path="/following" element={<Following />}></Route>
                  <Route path="/" element={<Home />} exact></Route>
                </Routes>
              </AuthProvider>
            </div>
      </Router>
    );
}

export default App;
