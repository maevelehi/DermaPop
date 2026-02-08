import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputCard from "../components/InputCard";
import AuthButton from "../components/AuthBtn";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "../styles/loginsignup.css";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;

      // save extra info in Firestore
      await setDoc(doc(db, "users", uid), {
        firstName,
        lastName,
        email,
      });

      navigate("/skin-type");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      id="signupView"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 fade-slide"
    >
      <img src="/logo.png" alt="App Logo" className="auth-image mb-6" />
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        type="text"
        placeholder="First Name"
        className="form-control"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        className="form-control"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
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

      <button className="btn" onClick={handleSignUp}>
        Create Account
      </button>

      <small className="mt-4">
        Already have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </small>
    </div>
  );
}
