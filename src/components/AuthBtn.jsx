export default function AuthButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
    >
      {text}
    </button>
  );
}
