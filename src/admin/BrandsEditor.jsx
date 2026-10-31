
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import BackButton from "../admin/BackButton";
import Dialog from "../components/Dialog";

export default function BrandsEditor() {
  const [brands, setBrands] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [brandFile, setBrandFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  function showDialog(type, title, message, autoClose = false) {
    setDialog({ open: true, type, title, message });

    if (autoClose) {
      setTimeout(() => {
        setDialog((prev) => ({ ...prev, open: false }));
      }, 2500);
    }
  }

  // Load brands from Supabase
  async function loadBrands() {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Could not load brands:", error);
      showDialog(
        "error",
        "Loading Failed",
        "Could not load brands. Check your Supabase brands table and permissions."
      );
      return;
    }

    setBrands(data || []);
  }

  useEffect(() => {
    loadBrands();
  }, []);

  // Select and preview logo
  function handleUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showDialog(
        "warning",
        "Invalid File",
        "Please choose an image for the brand logo."
      );
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showDialog(
        "warning",
        "Image Too Large",
        "Please choose a logo smaller than 5 MB."
      );
      e.target.value = "";
      return;
    }

    setBrandFile(file);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(file));
  }

  // Save logo to Storage and brand details to database
  async function saveBrand() {
    if (!brandName.trim() || !brandFile) {
      showDialog(
        "warning",
        "Missing Information",
        "Please enter a brand name and upload its logo."
      );
      return;
    }

    setLoading(true);

    let uploadedPath = null;

    try {
      const safeFileName = brandFile.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );

      const filePath = `brands/${Date.now()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-media")
        .upload(filePath, brandFile, {
          contentType: brandFile.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      uploadedPath = filePath;

      const { data: publicData } = supabase.storage
        .from("portfolio-media")
        .getPublicUrl(filePath);

      const logoUrl = publicData?.publicUrl;

      if (!logoUrl) {
        throw new Error("Could not generate the logo URL.");
      }

      const { data, error: insertError } = await supabase
        .from("brands")
        .insert([
          {
            name: brandName.trim(),
            logo_url: logoUrl,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setBrands((prev) => [data, ...prev]);
      setBrandName("");
      setBrandFile(null);

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setPreview("");

      const input = document.getElementById("brandUpload");
      if (input) input.value = "";

      window.dispatchEvent(new Event("brandsUpdated"));

      showDialog(
        "success",
        "Brand Saved 🎉",
        "Your brand has been added successfully.",
        true
      );
    } catch (error) {
      console.error("Could not save brand:", error);

      // Remove the uploaded logo if saving its database record failed
      if (uploadedPath) {
        const { error: cleanupError } = await supabase.storage
          .from("portfolio-media")
          .remove([uploadedPath]);

        if (cleanupError) {
          console.error("Could not remove failed upload:", cleanupError);
        }
      }

      showDialog(
        "error",
        "Save Failed",
        error.message ||
          "Could not save the brand. Check your Supabase Storage and database permissions."
      );
    } finally {
      setLoading(false);
    }
  }

  // Delete brand from database and Storage
  async function deleteBrand(brand) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${brand.name}?`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const logoPath = brand.logo_url?.split("/brands/")[1];

      const { error: deleteError } = await supabase
        .from("brands")
        .delete()
        .eq("id", brand.id);

      if (deleteError) {
        throw deleteError;
      }

      if (logoPath) {
        const { error: storageError } = await supabase.storage
          .from("portfolio-media")
          .remove([`brands/${logoPath}`]);

        if (storageError) {
          console.error("Logo cleanup failed:", storageError);
        }
      }

      setBrands((prev) => prev.filter((item) => item.id !== brand.id));

      window.dispatchEvent(new Event("brandsUpdated"));

      showDialog(
        "success",
        "Brand Deleted",
        "The brand has been removed successfully.",
        true
      );
    } catch (error) {
      console.error("Could not delete brand:", error);

      showDialog(
        "error",
        "Delete Failed",
        error.message ||
          "The brand could not be deleted. Check your Supabase permissions."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={() =>
          setDialog((prev) => ({ ...prev, open: false }))
        }
      />

      <div className="min-h-screen bg-[#FFFFF0] text-[#382B24] py-12 px-5">
        <BackButton />

        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-[5px] text-xs mb-2">
            Admin Panel
          </p>

          <h1 className="text-4xl font-serif mb-8">
            Brands Editor
          </h1>

          <div className="bg-[#111] rounded-[30px] border border-[#382B24] p-6 space-y-5">
            <div>
              <label
                htmlFor="brandName"
                className="block text-[#B47C68] text-sm uppercase tracking-[2px] mb-2"
              >
                Brand Name
              </label>

              <input
                id="brandName"
                type="text"
                placeholder="e.g. Rare Beauty"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#1d1d1d] rounded-xl p-4 text-white outline-none border border-transparent focus:border-[#B47C68]"
              />
            </div>

            <label className="flex items-center justify-center bg-[#382B24] text-[#FFFFF0] hover:bg-[#A47764] transition rounded-full py-3 cursor-pointer font-semibold">
              {brandFile ? "Change Brand Logo" : "Upload Brand Logo"}

              <input
                id="brandUpload"
                hidden
                type="file"
                accept="image/*"
                onChange={handleUpload}
              />
            </label>

            {preview && (
              <div className="flex flex-col items-center pt-4">
                <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-[#A47764] bg-[#1a1a1a] p-1">
                  <img
                    src={preview}
                    alt="Brand logo preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <h2 className="mt-5 text-xl font-serif text-[#FFFFF0] tracking-wide text-center">
                  {brandName.trim() || "Brand Name"}
                </h2>

                <div className="w-12 h-[2px] bg-[#A47764] rounded-full mt-2" />
              </div>
            )}

            <button
              type="button"
              onClick={saveBrand}
              disabled={loading}
              className="w-full bg-[#382B24] text-[#FFFFF0] hover:bg-[#A47764] disabled:opacity-50 py-4 rounded-full font-semibold transition"
            >
              {loading ? "Please wait..." : "Save Brand"}
            </button>
          </div>

          <div className="mt-14">
            <h2 className="text-3xl font-serif mb-8">
              Saved Brands
            </h2>

            {brands.length === 0 ? (
              <div className="bg-[#111] rounded-[30px] border border-[#382B24] py-12 text-center text-gray-500">
                No brands added yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-[#382B24] bg-[#1a1a1a] p-1 transition duration-300 group-hover:scale-105">
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    <h3 className="mt-4 text-lg font-serif">
                      {brand.name}
                    </h3>

                    <div className="w-8 h-[1px] bg-[#382B24] mt-2 group-hover:w-12 transition-all duration-300" />

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => deleteBrand(brand)}
                      className="mt-4 text-red-500 hover:text-red-700 disabled:opacity-50 text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
