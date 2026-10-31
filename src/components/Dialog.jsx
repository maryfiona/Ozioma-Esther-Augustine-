import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

export default function Dialog({
  open,
  type = "success",
  title,
  message,
  onClose,
}) {
  if (!open) return null;

  const styles = {
    success: {
      icon: <FaCheckCircle className="text-green-400 text-6xl" />,
      border: "border-green-400/30",
      button: "bg-green-500 hover:bg-green-400",
      glow: "shadow-green-500/20",
    },
    error: {
      icon: <FaTimesCircle className="text-red-400 text-6xl" />,
      border: "border-red-400/30",
      button: "bg-red-500 hover:bg-red-400",
      glow: "shadow-red-500/20",
    },
    warning: {
      icon: <FaExclamationTriangle className="text-yellow-400 text-6xl" />,
      border: "border-yellow-400/30",
      button: "bg-yellow-500 hover:bg-yellow-400 text-black",
      glow: "shadow-yellow-500/20",
    },
    info: {
      icon: <FaInfoCircle className="text-pink-400 text-6xl" />,
      border: "border-pink-500/30",
      button: "bg-pink-500 hover:bg-pink-400",
      glow: "shadow-pink-500/20",
    },
  };

  const current = styles[type] || styles.success;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md px-4 animate-fadeIn">
      <div
        className={`w-full max-w-md rounded-[32px] bg-[#171717] border ${current.border} p-8 text-center shadow-2xl ${current.glow}`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">{current.icon}</div>

        {/* Title */}
        <h2 className="text-3xl font-serif text-white mb-3">{title}</h2>

        {/* Message */}
        <p className="text-gray-300 leading-7 mb-8">{message}</p>

        {/* Button */}
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${current.button}`}
        >
          Okay
        </button>
      </div>
    </div>
  );
}