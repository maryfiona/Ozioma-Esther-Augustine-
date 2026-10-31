import Brands from "../components/Brands.jsx";
import Videos from "../components/Videos.jsx";
import Hero from "../components/Hero.jsx";
import Testimonials from "../components/Testimonials.jsx";
import About from "../components/About.jsx";
import Contact from "../components/Contact.jsx";
import ResultsServices from "../components/ResultServices.jsx";


export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Brands />
      <Videos />
      <Testimonials />
      <ResultsServices/>
      <Contact />
    </>
  );
}