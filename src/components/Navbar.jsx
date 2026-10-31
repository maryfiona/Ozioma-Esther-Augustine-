import { useState } from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-5 md:px-12 py-1">
      <nav className="max-w-7xl mx-auto backdrop-blur-xl bg-black border border-white/10 rounded-full px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          className="text-white text-2xl font-serif tracking-wide"
        > 
         Ozioma Esther Augustine 
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center text-espresso gap-8 text-sm uppercase tracking-[3px]">

          <button onClick={() => scrollTo("about")} className="hover:text-[#A47764] transition">
            About
          </button>

          <button onClick={() => scrollTo("videos")} className="hover:text-[#A47764] transition">
            Videos
          </button>

          <button onClick={() => scrollTo("brands")} className="hover:text-[#A47764] transition">
            Brands
          </button>

          <button onClick={() => scrollTo("testimonials")} className="hover:text-[#A47764] transition">
            Reviews
          </button>

          <button onClick={() => scrollTo("contact")} className="hover:text-[#A47764] transition">
            Contact
          </button>

        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-5">

          <a href="https://www.instagram.com/estheraugustine_12?exln=MXdyOTh5ZGQ5d25nOA%3D%3D&utm_source=qr " target="_blank">
            <FaInstagram className="text-white text-xl hover:text-[#A47764] transition" />
          </a>

          <a href="https://www.tiktok.com/@esthersglowdiary" target="_blank">
            <FaTiktok className="text-white text-xl hover:text-[#A47764] transition" />
          </a>

          <button
            onClick={() => scrollTo("contact")}
            className="bg-[#FFFFF0] hover:bg-[#A47764] text-[#382B24] px-5 py-2 rounded-full text-sm transition"
          >
            Book Now
          </button>

        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX size={30} /> : <HiMenu size={30} />}
        </button>

      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 rounded-3xl bg-[#111111]/95 backdrop-blur-xl border border-white/10 p-6 space-y-6 text-center text-gray-300">

          <button onClick={() => scrollTo("about")} className="block w-full hover:text-pink-400">
            About
          </button>

          <button onClick={() => scrollTo("videos")} className="block w-full hover:text-pink-400">
            Videos
          </button>

          <button onClick={() => scrollTo("brands")} className="block w-full hover:text-pink-400">
            Brands
          </button>

          <button onClick={() => scrollTo("testimonials")} className="block w-full hover:text-pink-400">
            Reviews
          </button>

          <button onClick={() => scrollTo("contact")} className="block w-full hover:text-pink-400">
            Contact
          </button>

          <div className="flex justify-center gap-6 text-2xl pt-4">
            <FaInstagram className="hover:text-pink-400" />
            <FaTiktok className="hover:text-pink-400" />
          </div>

        </div>
      )}
    </header>
  );
}