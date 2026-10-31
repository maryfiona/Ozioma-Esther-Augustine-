


import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const STORAGE_KEY = "portfolio_testimonials";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    function getTestimonials() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];

        setTestimonials(
          Array.isArray(parsed)
            ? parsed.sort(
                (a, b) =>
                  new Date(b.created_at) - new Date(a.created_at)
              )
            : []
        );
      } catch (error) {
        console.error("Testimonials loading error:", error);
        setTestimonials([]);
      }
    }

    getTestimonials();

    // Update when the admin saves changes in this browser.
    window.addEventListener("testimonialsUpdated", getTestimonials);

    // Also update if localStorage changes in another browser tab.
    window.addEventListener("storage", getTestimonials);

    return () => {
      window.removeEventListener("testimonialsUpdated", getTestimonials);
      window.removeEventListener("storage", getTestimonials);
    };
  }, []);

  return (
    <section
      id="testimonials"
      className="bg-[#FFFFF0] py-24 px-5 sm:px-8 lg:px-14"
    >
      <div className="max-w-7xl mx-auto">
        <p className="uppercase tracking-[6px] text-[#A47764] text-sm mb-3">
          Testimonials
        </p>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#A47764] mb-4">
          Loved by brands.
        </h2>

        <p className="text-gray-400 max-w-xl mb-14 leading-7">
          Real feedback from brands and clients I've worked with.
        </p>

        {testimonials.length === 0 && (
          <div className="bg-[#111111] rounded-[28px] border border-[#382B24] p-10 text-center">
            <p className="text-gray-400">
              No testimonials yet. Add your first testimonial from the Admin Panel.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111111] rounded-[28px] p-7 border border-[#382B24] hover:border-[#382B24] transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white"
                  />
                )}

                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {item.name}
                  </h3>

                  <p className="text-[#382B24] text-sm">
                    {item.brand}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-5">
                {Array.from({ length: item.rating || 5 }).map(
                  (_, index) => (
                    <FaStar
                      key={index}
                      className="text-yellow-400 text-sm"
                    />
                  )
                )}
              </div>

              <p className="text-gray-300 leading-7 italic">
                "{item.review}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}