import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";

import Dashboard from "./admin/Dashboard";
import VideosEditor from "./admin/VideosEditor";
import BrandsEditor from "./admin/BrandsEditor";
import HeroEditor from "./admin/HeroEditor";
import TestimonialsEditor from "./admin/TestimonialEditor";
import ContactEditor from "./admin/ContactEditor";
import ResultServicesEditor from "./admin/ResultServicesEditor";
import Login from "./admin/Login";

import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes() {
  const location = useLocation();

  // Hide Navbar on all admin pages
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Website */}
        <Route path="/" element={<Home />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Videos Editor */}
        <Route
          path="/admin/videos"
          element={
            <ProtectedRoute>
              <VideosEditor />
            </ProtectedRoute>
          }
        />

        {/* Brands Editor */}
        <Route
          path="/admin/brands"
          element={
            <ProtectedRoute>
              <BrandsEditor />
            </ProtectedRoute>
          }
        />

        {/* Hero Editor */}
        <Route
          path="/admin/hero"
          element={
            <ProtectedRoute>
              <HeroEditor />
            </ProtectedRoute>
          }
        />

        {/* Results & Services Editor */}
        <Route
          path="/admin/results"
          element={
            <ProtectedRoute>
              <ResultServicesEditor />
            </ProtectedRoute>
          }
        />

        {/* Testimonials Editor */}
        <Route
          path="/admin/testimonials"
          element={
            <ProtectedRoute>
              <TestimonialsEditor />
            </ProtectedRoute>
          }
        />

        {/* Contact Editor */}
        <Route
          path="/admin/contact"
          element={
            <ProtectedRoute>
              <ContactEditor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}