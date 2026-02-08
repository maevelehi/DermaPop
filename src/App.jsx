import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import ProductPage from "./pages/ProductPage";
import SkinType from "./pages/SkinType";
import ProblemSelector from "./pages/ProblemSelector";
import ProductDetail from "./pages/ProductDetail";
// import { useEffect } from "react";
// import { seedProductsIfEmpty } from "./seedProducts";


function App() {
  // useEffect(() => {
  //   seedProductsIfEmpty().catch(console.error);
  // }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/skin-type" element={<SkinType />} />
        <Route path="/problems" element={<ProblemSelector />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
