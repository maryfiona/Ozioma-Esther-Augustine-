import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState({
    open: false,
    success: false,
    title: "",
    message: "",
  });

  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();

    setLoading(true);

    // Small loading effect
    await new Promise((resolve) => setTimeout(resolve, 1800));

    if (email === "estheraustin360@gmail.com" && password === "OziomaEsther") {
      localStorage.setItem("admin", "true");

      setDialog({
        open: true,
        success: true,
        title: "Login Successful",
        message: "Welcome back! Redirecting to your dashboard...",
      });

      setTimeout(() => {
        navigate("/admin");
      }, 1800);
    } else {
      setDialog({
        open: true,
        success: false,
        title: "Login Failed",
        message: "Wrong email or password. Please try again.",
      });

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">

      {/* Custom Dialog */}
      {dialog.open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-5">
          <div className="bg-[#111] border border-pink-500/20 rounded-[28px] p-8 w-full max-w-sm text-center animate-fadeIn">

            <div className="flex justify-center mb-5">
              {dialog.success ? (
                <FaCheckCircle className="text-green-400 text-6xl" />
              ) : (
                <FaTimesCircle className="text-red-400 text-6xl" />
              )}
            </div>

            <h2 className="text-3xl font-serif text-white mb-3">
              {dialog.title}
            </h2>

            <p className="text-gray-300 mb-6">
              {dialog.message}
            </p>

            {!dialog.success && (
              <button
                onClick={() =>
                  setDialog({
                    ...dialog,
                    open: false,
                  })
                }
                className="w-full bg-pink-500 hover:bg-pink-400 py-3 rounded-full font-semibold transition"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Login Card */}
      <form
        onSubmit={login}
        className="bg-[#111] p-10 rounded-[32px] w-full max-w-md border border-[#382B24]"
      >
        <p className="uppercase tracking-[5px] text-[#A47764] text-xs mb-2">
          Ozioma Portfolio
        </p>

        <h1 className="text-4xl font-serif mb-2 text-white">
          Admin Login
        </h1>

        <p className="text-gray-400 mb-8">
          Welcome back.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-5 bg-[#1d1d1d] p-4 rounded-xl text-white outline-none border border-transparent focus:border-[#A47764]"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 bg-[#1d1d1d] p-4 rounded-xl text-white outline-none border border-transparent focus:border-[#A47764]"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#A47764] hover:bg-[#382B24] rounded-full py-4 font-semibold flex items-center justify-center gap-3 transition disabled:opacity-70"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Signing In...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </main>
  );
}