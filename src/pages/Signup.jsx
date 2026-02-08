import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "../styles/loginsignup.css";
import { authErrorMessage } from "../utils/authErrorMessage";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

  const handleSignUp = async () => {
    setError("");

    const trimmedEmail = email.trim();
    if (!firstName.trim() || !lastName.trim() || !trimmedEmail || !password) {
      showError("Please fill in first name, last name, email, and password.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password,
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: trimmedEmail,
      });

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
      id="signupView"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 fade-slide font-sans"
    >
      <h1 className="text-4xl font-bold mb-6">Sign Up</h1>

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

      <button className="btn" onClick={handleSignUp} disabled={loading}>
        {loading ? "Creating..." : "Create Account"}
      </button>

      <p className="mt-4 font-sans">
        Already have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer font-sans"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}
