import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputCard from "../components/InputCard";
import AuthButton from "../components/AuthBtn";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/loginsignup.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // redirect to main app page
      navigate("/skin-type");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      id="loginView"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 fade-slide font-sans"
    >
      <img src="/login2.png" alt="Logo" className="auth-image w-65 -mb-10" />      
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn font-sans" onClick={handleLogin}>
        Login
      </button>
      <small className="mt-4 font-sans">
        Don't have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer font-sans"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </span>
      </small>
    </div>
  );
}
