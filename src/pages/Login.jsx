import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/loginsignup.css";
import { authErrorMessage } from "../utils/authErrorMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const showError = (msg) => {
    setError(msg || "");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setError(""), 5000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleLogin = async () => {
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      showError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      navigate("/skin-type");
    } catch (err) {
      showError(authErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="loginView"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 fade-slide font-sans"
    >
      {/* <img src="/login2.png" alt="Logo" className="auth-image w-65 -mb-10" /> */}
      <h1 className="text-4xl font-bold mb-6">Login</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />
      <input
        type="password"
        placeholder="Password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />

      <button className="btn font-sans" onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="mt-4 font-sans mb-6">
        Don't have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer font-sans"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </span>
      </p>
    </div>
  );
}
