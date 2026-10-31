import { useBreakpoint } from "../hooks/usBreakpoint";
import Sidebar from "./Sidebar";
import { NavLink } from "react-router-dom";
import {
  FaVideo,
  FaBuilding,
  FaStar,
  FaUser,
  FaChartBar,
  FaEnvelope,
} from "react-icons/fa";

export default function Dashboard() {
  const isDesktop = useBreakpoint("md");

  const cards = [
    {
      title: "VIDEOS",
      icon: <FaVideo className="text-3xl text-[#382B24]" />,
      path: "/admin/videos",
      desc: "Upload and manage videos",
    },
    {
      title: "BRANDS",
      icon: <FaBuilding className="text-3xl text-[#382B24]" />,
      path: "/admin/brands",
      desc: "Add and edit brand logos",
    },
    {
      title: "HERO",
      icon: <FaUser className="text-3xl text-[#382B24]" />,
      path: "/admin/hero",
      desc: "Change homepage hero section",
    },
    {
      title: "RESULTS & SERVICES",
      icon: <FaChartBar className="text-3xl text-[#382B24]" />,
      path: "/admin/results",
      desc: "Edit campaign results and services",
    },
    {
      title: "TESTIMONIALS",
      icon: <FaStar className="text-3xl text-[#382B24]" />,
      path: "/admin/testimonials",
      desc: "Manage client testimonials",
    },
    {
      title: "CONTACT",
      icon: <FaEnvelope className="text-3xl text-[#382B24]" />,
      path: "/admin/contact",
      desc: "Update contact information",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar disappears on mobile */}
      {isDesktop && <Sidebar />}

      <main className="flex-1 w-full p-5 sm:p-6 md:p-10">
        <p className="uppercase tracking-[5px] text-[#A47764] text-xs mb-2">
          Admin Panel
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-3">
          Dashboard
        </h1>

        <p className="text-gray-400 mb-10">
          Welcome to your Ozioma content management system.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <NavLink
              key={card.title}
              to={card.path}
              className="bg-white border border-[#A47764] rounded-[28px] p-6 hover:border-[#382B24] hover:bg-[#A47764] transition-all duration-300"
            >
              <div className="mb-5">{card.icon}</div>

              <h2 className="text-[#382B24] uppercase tracking-[3px] text-sm mb-2">
                {card.title}
              </h2>

              <p className="text-gray-400 text-sm leading-6">{card.desc}</p>
            </NavLink>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#A47764] to-[#382B24] border border-pink-500/20 rounded-[28px] p-6">
          <h2 className="text-xl sm:text-2xl font-serif text-pink-200 mb-3">
            Quick Tip
          </h2>

          <p className="text-gray-300 leading-7">
            Click any card above to edit that section of your portfolio. Any
            changes you save in the admin panel will automatically appear on your
            website.
          </p>
        </div>
      </main>
    </div>
  );
}