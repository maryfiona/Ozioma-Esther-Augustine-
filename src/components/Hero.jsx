
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabase";

const defaultHero = {
  heading: "Creating aesthetic UGC for beauty and lifestyle brands",
  subheading: "SKINCARE • BEAUTY • LIFESTYLE",
  description:
    "I bring products to life through refined visuals and relatable storytelling that inspire trust, engage audiences, and help brands connect with ideal customers. ",
  image_url: "/src/assets/OziomaImg.jpeg",
};

export default function Hero() {
  const [hero, setHero] = useState(defaultHero);

  useEffect(() => {
    getHero();

    const channel = supabase
      .channel("hero-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hero",
        },
        () => {
          getHero();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function getHero() {
    const { data, error } = await supabase
      .from("hero")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Hero Fetch Error:", error);
      return;
    }

    // If no saved Hero exists, show the default Hero.
    if (!data || data.length === 0) {
      setHero(defaultHero);
      return;
    }

    const latestHero = data[0];

    setHero({
      heading: latestHero.heading || defaultHero.heading,
      subheading: latestHero.subheading || defaultHero.subheading,
      description: latestHero.description || defaultHero.description,
      image_url: latestHero.image_url || defaultHero.image_url,
    });
  }

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center bg-[#FFFFF0] text-[#382B24] py-20 px-5 sm:px-8 lg:px-16 overflow-hidden font-body"
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <p className="uppercase tracking-[4px] sm:tracking-[6px] text-[#A47764] text-xs sm:text-sm mb-5 font-body">
            {hero.subheading}
          </p>

          <h1 className="font-heading font-medium leading-[1.05] tracking-tight mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-6xl text-[#382B24]">
  {hero.heading}
</h1>

          <p className="font-body text-[#6F6259] text-base sm:text-lg leading-8 max-w-xl mx-auto lg:mx-0 mb-8">
            {hero.description}
          </p>

          <div className="flex justify-center lg:justify-start">
            <button
              onClick={scrollToContact}
              className="bg-[#382B24] text-[#FFFFF0] hover:bg-[#A47764] transition-all duration-300 px-8 py-4 rounded-full font-body font-medium tracking-wide"
            >
              Let&apos;s Collaborate
            </button>
          </div>

          {/* MOBILE IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center mt-12 lg:hidden"
          >
            <div className="absolute w-64 h-64 bg-[#D8C3A5] rounded-full blur-[100px] opacity-50" />

            <img
              src={hero.image_url}
              alt="UGC Creator"
              className="relative w-[260px] sm:w-[320px] rounded-[30px] object-cover border border-[#D8C3A5] shadow-xl"
            />
          </motion.div>
        </motion.div>

        {/* DESKTOP IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="hidden lg:flex justify-center relative"
        >
          <div className="absolute w-[420px] h-[420px] bg-[#D8C3A5] rounded-full blur-[120px] opacity-50" />

          <img
            src={hero.image_url}
            alt="UGC Creator"
            className="relative w-[420px] h-[560px] rounded-[32px] object-cover border border-[#D8C3A5] shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
