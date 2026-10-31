import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/admin")}
      className="inline-flex items-center gap-3 bg-[#382B24] border border- border-[#382B24] hover:border-[#382B24] hover:bg-[#382B24] text-white px-5 py-3 rounded-full transition-all duration-300 mb-8"
    >
      <FaArrowLeft />
      Back to Dashboard
    </button>
  );
}