import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import ProductPage from "./pages/ ProductPage";
import SkinType from "./pages/SkinType";
import ProblemSelector from "./pages/ProblemSelector";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/productpage" element={<ProductPage />} />
        <Route path="/skin-type" element={<SkinType />} />
        <Route path="/problems" element={<ProblemSelector />} />
      </Routes>
    </Router>
  );
}

export default App;
