
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { FaSave, FaUpload, FaTrash } from "react-icons/fa";
import BackButton from "./BackButton";
import Dialog from "../components/Dialog";

export default function HeroEditor() {
  const [rowId, setRowId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    heading: "",
    subheading: "",
    description: "",
    image_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [dialog, setDialog] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  function showDialog(type, title, message) {
    setDialog({ open: true, type, title, message });
  }

  function closeDialog() {
    setDialog((prev) => ({ ...prev, open: false }));
  }

  useEffect(() => {
    fetchHero();
  }, []);

  async function fetchHero() {
    const { data, error } = await supabase
      .from("hero")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching Hero:", error);
      showDialog("error", "Loading Failed", error.message);
      return;
    }

    if (data && data.length > 0) {
      const savedHero = data[0];

      setRowId(savedHero.id);
      setForm({
        heading: savedHero.heading || "",
        subheading: savedHero.subheading || "",
        description: savedHero.description || "",
        image_url: savedHero.image_url || "",
      });
      setPreview(savedHero.image_url || "");
    } else {
      setRowId(null);
      setForm({
        heading: "",
        subheading: "",
        description: "",
        image_url: "",
      });
      setPreview("");
      setImageFile(null);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleImage(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showDialog("error", "Invalid File", "Please select a valid image file.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function saveHero() {
    if (loading || deleting) return;

    setLoading(true);

    try {
      let imageUrl = form.image_url;

      if (imageFile) {
        const safeFileName = imageFile.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "-"
        );

        const fileName = `hero/${Date.now()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio-media")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("portfolio-media")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      const heroData = {
        heading: form.heading.trim(),
        subheading: form.subheading.trim(),
        description: form.description.trim(),
        image_url: imageUrl,
      };

      if (rowId) {
        const { error } = await supabase
          .from("hero")
          .update(heroData)
          .eq("id", rowId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("hero")
          .insert([heroData])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          setRowId(data[0].id);
        }
      }

      setForm((prev) => ({ ...prev, image_url: imageUrl }));
      setImageFile(null);

      await fetchHero();

      showDialog(
        "success",
        "Success!",
        "Your Hero section has been saved successfully."
      );
    } catch (err) {
      console.error("Error saving Hero:", err);
      showDialog(
        "error",
        "Save Failed",
        err.message || "Something went wrong while saving your Hero."
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteHero() {
    if (deleting || loading) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete the saved Hero content? The default Hero will appear on the website."
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      // Delete every saved Hero row.
      const { error } = await supabase
        .from("hero")
        .delete()
        .not("id", "is", null);

      if (error) throw error;

      // Reset the admin editor.
      setRowId(null);
      setImageFile(null);
      setPreview("");
      setForm({
        heading: "",
        subheading: "",
        description: "",
        image_url: "",
      });

      showDialog(
        "success",
        "Deleted Successfully!",
        "Saved Hero content has been deleted from Supabase. The default Hero will appear on the website."
      );
    } catch (err) {
      console.error("Error deleting Hero:", err);

      showDialog(
        "error",
        "Delete Failed",
        err.message || "Could not delete the Hero content."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFFF0] text-[#382B24] py-10 px-5">
      <div className="max-w-4xl mx-auto">
        <BackButton />

        <p className="uppercase tracking-[5px] text-[#A47764] text-xs mb-2">
          Admin Panel
        </p>

        <h1 className="text-4xl  font-serif mb-8">Hero Editor</h1>

        <div className="bg-[#161616] rounded-[30px] border  border-text-[#A47764] p-6 space-y-6">
          <div>
            <label className="block  text-[#A47764] text-sm uppercase tracking-[2px] mb-2">
              Heading
            </label>
            <input
              type="text"
              name="heading"
              value={form.heading}
              onChange={handleChange}
              placeholder="Creating content that sells..."
              className="w-full bg-[#242424] rounded-xl p-4 outline-none border border-transparent focus:border-[#A47764]"
            />
          </div>

          <div>
            <label className="block text-[#A47764] text-sm uppercase tracking-[2px] mb-2">
              Subheading
            </label>
            <input
              type="text"
              name="subheading"
              value={form.subheading}
              onChange={handleChange}
              placeholder="SKINCARE • Beauty • Lifestyle"
              className="w-full bg-[#242424] rounded-xl p-4 outline-none border border-transparent focus:border-[#A47764]"
            />
          </div>

          <div>
            <label className="block text-[#A47764] text-sm uppercase tracking-[2px] mb-2">
              Description
            </label>
            <textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write your Hero description..."
              className="w-full bg-[#242424] rounded-xl p-4 outline-none resize-none border border-transparent focus:border-[#A47764]"
            />
          </div>

          <div>
            <label className="block text-[#A47764] text-sm uppercase tracking-[2px] mb-3">
              Hero Image
            </label>

            <label className="flex items-center  justify-center gap-3 bg-[#382B24] text-[#FFFFF0] hover:bg-[#A47764]   py-3 px-5 rounded-full cursor-pointer font-semibold transition">
              <FaUpload />
              {imageFile ? "Choose Another Image" : "Upload Hero Image"}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
            </label>

            {imageFile && (
              <p className="text-sm text-gray-400 mt-2 text-center">
                Selected: {imageFile.name}
              </p>
            )}
          </div>

          {preview && (
            <div>
              <p className="text-sm text-gray-400 mb-3">Image Preview</p>
              <img
                src={preview}
                alt="Hero preview"
                className="w-full h-72 object-cover rounded-2xl border border-pink-500/20"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="button"
              onClick={saveHero}
              disabled={loading || deleting}
              className="flex-1 bg-[#382B24] text-[#FFFFF0] hover:bg-[#A47764]  py-4 rounded-full font-semibold flex items-center justify-center gap-3 disabled:opacity-50 transition"
            >
              <FaSave />
              {loading ? "Saving Hero..." : "Save Hero"}
            </button>

            <button
              type="button"
              onClick={deleteHero}
              disabled={loading || deleting}
              className="flex-1 bg-red-500 hover:bg-red-500 py-4 rounded-full font-semibold flex items-center justify-center gap-3 disabled:opacity-50 transition"
            >
              <FaTrash />
              {deleting ? "Deleting Hero..." : "Delete Hero"}
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={closeDialog}
      />
    </div>
  );
}
