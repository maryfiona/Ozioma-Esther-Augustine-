import { NavLink } from "react-router-dom"; 
import { 
  FaVideo, 
  FaStar, 
  FaUser, 
  FaBuilding, 
  FaEnvelope, 
  FaChartBar, 
  FaSignOutAlt, 
} from "react-icons/fa"; 
 
export default function Sidebar() { 
  const menuClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${ 
      isActive 
        ? "bg-[#A47764] text-white" 
        : "text-gray-300 hover:bg-[#A47764] hover:text-white" 
    }`; 
 
  return ( 
    <aside className="bg-[#111111] w-64 min-h-screen p-8 border-r border-[#A47764]">
  
 
      {/* Logo */} 
      <h1 className="text-[#A47764] text-2xl font-serif mb-10"> 
        Ozioma
      </h1> 
 
      {/* Navigation */} 
      <nav className="space-y-3"> 
 
        <NavLink to="/admin/videos" className={menuClass}> 
          <FaVideo /> 
          Videos 
        </NavLink> 
 
        <NavLink to="/admin/brands" className={menuClass}> 
          <FaBuilding /> 
          Brands 
        </NavLink> 
 
        <NavLink to="/admin/hero" className={menuClass}> 
          <FaUser /> 
          Hero 
        </NavLink> 
 
        <NavLink to="/admin/results" className={menuClass}> 
          <FaChartBar /> 
          Results & Services 
        </NavLink> 
 
        <NavLink to="/admin/testimonials" className={menuClass}> 
          <FaStar /> 
          Testimonials 
        </NavLink> 
 
        <NavLink to="/admin/contact" className={menuClass}> 
          <FaEnvelope /> 
          Contact 
        </NavLink> 
 
      </nav> 
 
      {/* Logout */} 
      <button 
        onClick={() => { 
          localStorage.removeItem("admin"); 
          window.location.href = "/admin/login"; 
        }} 
        className="flex items-center gap-3 text-red-500 hover:text-[#A47764] mt-12" 
      > 
        <FaSignOutAlt /> 
        Logout 
      </button> 
 
    </aside> 
  ); 
}