import Home from "./components/Home";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="app">
              <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/" element={<Home />} exact></Route>
              </Routes>
            </div>
      </Router>
    );
}

export default App;
