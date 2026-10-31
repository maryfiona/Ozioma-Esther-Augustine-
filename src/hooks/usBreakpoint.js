import { useEffect, useState } from "react";

export function useBreakpoint(breakpoint = "md") {
  const sizes = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  };

  const [matches, setMatches] = useState(
    window.innerWidth >= sizes[breakpoint]
  );

  useEffect(() => {
    function handleResize() {
      setMatches(window.innerWidth >= sizes[breakpoint]);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return matches;
}