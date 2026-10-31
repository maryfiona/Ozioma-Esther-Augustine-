
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadBrands() {
      const { data, error } = await supabase
        .from("brands")
        .select("id, name, logo_url, created_at")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error("Error loading brands:", error);
        setBrands([]);
      } else {
        setBrands(data || []);
      }

      setLoading(false);
    }

    loadBrands();

    // Update the public page when the admin saves or deletes a brand
    const channel = supabase
      .channel("public-brands-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "brands",
        },
        () => {
          loadBrands();
        }
      )
      .subscribe();

    // Also refresh immediately when the admin saves or deletes
    function handleBrandsUpdated() {
      loadBrands();
    }

    window.addEventListener("brandsUpdated", handleBrandsUpdated);

    return () => {
      active = false;
      window.removeEventListener("brandsUpdated", handleBrandsUpdated);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section
      id="brands"
      className="scroll-mt-28 bg-[#FFFFF0] py-24 px-5 sm:px-8 lg:px-12 text-[#29231F]"
    >
      <p className="uppercase tracking-[6px] text-[#29231F] text-xs mb-3">
        Trusted By
      </p>

      <h2 className="text-4xl sm:text-5xl font-serif mb-14">
        Brands I've Worked With
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading brands...</p>
      ) : brands.length === 0 ? (
        <p className="text-gray-500">No brands added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-10 justify-items-center">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border border-[#29231F] bg-[#29231F] p-1 transition duration-300 group-hover:scale-105">
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <h3 className="mt-5 font-serif text-lg sm:text-xl text-[#29231F] tracking-wide capitalize">
                {brand.name}
              </h3>

              <div className="w-10 h-[1px] bg-[#29231F] mt-2 group-hover:w-16 transition-all duration-300" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
