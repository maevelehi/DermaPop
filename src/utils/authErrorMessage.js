// src/utils/authErrorMessage.js

export function authErrorMessage(err) {
  const code = err?.code || "";

  // Firebase Auth error codes:
  // https://firebase.google.com/docs/reference/js/auth
  switch (code) {
    // Common login
    case "auth/invalid-email":
      return "That email address looks invalid. Please check it and try again.";
    case "auth/user-not-found":
      return "No account found with that email. Try signing up instead.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-credential":
      return "Incorrect email or password. Please try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";

    // Password / signup
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters (more is better).";
    case "auth/email-already-in-use":
      return "This email is already in use. Try logging in instead.";

    // Rate limiting / network
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a bit and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";

    // Missing fields (sometimes you’ll catch this before calling Firebase)
    case "auth/missing-email":
      return "Please enter your email.";
    case "auth/missing-password":
      return "Please enter your password.";

    default:
      return "Something went wrong. Please try again.";
  }
}
