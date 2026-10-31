import { useEffect, useState } from "react";
import BackButton from "./BackButton";
import Dialog from "../components/Dialog";
import {
  FaUpload,
  FaTrash,
  FaSave,
  FaEdit,
  FaStar,
} from "react-icons/fa";

const STORAGE_KEY = "portfolio_testimonials";

export default function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    review: "",
    rating: 5,
    image_url: "",
  });

  const [preview, setPreview] = useState("");

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

  useEffect(() => {
    fetchTestimonials();

    function handleStorageChange() {
      fetchTestimonials();
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  function fetchTestimonials() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];

      const sorted = Array.isArray(parsed)
        ? parsed.sort(
            (a, b) =>
              new Date(b.created_at) - new Date(a.created_at)
          )
        : [];

      setTestimonials(sorted);
    } catch (error) {
      console.error("Fetch testimonials error:", error);
      showDialog("error", "Loading Failed", "Could not load saved testimonials.");
    }
  }

  function saveToStorage(updatedTestimonials) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedTestimonials)
    );

    setTestimonials(updatedTestimonials);

    // Notify the public Testimonials section immediately.
    window.dispatchEvent(new Event("testimonialsUpdated"));
  }

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "rating"
          ? Number(e.target.value)
          : e.target.value,
    }));
  }

  function handleImage(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showDialog("warning", "Invalid File", "Please select an image.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;

      setPreview(imageData);
      setForm((prev) => ({
        ...prev,
        image_url: imageData,
      }));
    };

    reader.onerror = () => {
      showDialog("error", "Upload Failed", "Could not read the selected image.");
    };

    reader.readAsDataURL(file);
  }

  function saveTestimonial() {
    if (!form.name.trim() || !form.review.trim()) {
      showDialog(
        "warning",
        "Missing Information",
        "Please enter the customer's name and review."
      );
      return;
    }

    setLoading(true);

    try {
      const testimonial = {
        ...form,
        name: form.name.trim(),
        brand: form.brand.trim(),
        review: form.review.trim(),
        rating: Number(form.rating),
        created_at: new Date().toISOString(),
      };

      let updatedTestimonials;

      if (editingId) {
        updatedTestimonials = testimonials.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...testimonial,
                created_at: item.created_at,
              }
            : item
        );
      } else {
        updatedTestimonials = [
          {
            id: Date.now(),
            ...testimonial,
          },
          ...testimonials,
        ];
      }

      saveToStorage(updatedTestimonials);

      showDialog(
        "success",
        editingId ? "Testimonial Updated 💖" : "Testimonial Added 🎉",
        editingId
          ? "The testimonial has been updated successfully."
          : "The testimonial has been added successfully.",
        true
      );

      resetForm();
    } catch (error) {
      console.error("Save testimonial error:", error);

      showDialog(
        "error",
        "Save Failed",
        "Your browser storage may be full. Try using a smaller customer photo."
      );
    } finally {
      setLoading(false);
    }
  }

  function editTestimonial(item) {
    setEditingId(item.id);

    setForm({
      name: item.name || "",
      brand: item.brand || "",
      review: item.review || "",
      rating: item.rating || 5,
      image_url: item.image_url || "",
    });

    setPreview(item.image_url || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteTestimonial(item) {
    const confirmed = window.confirm(
      `Are you sure you want to delete testimonial?`
    );

    if (!confirmed) return;

    try {
      const updatedTestimonials = testimonials.filter(
        (testimonial) => testimonial.id !== item.id
      );

      saveToStorage(updatedTestimonials);

      if (editingId === item.id) {
        resetForm();
      }

      showDialog(
        "success",
        "Testimonial Deleted 🗑️",
        "The testimonial has been deleted successfully.",
        true
      );
    } catch (error) {
      console.error("Delete testimonial error:", error);
      showDialog("error", "Delete Failed", "Could not delete this testimonial.");
    }
  }

  function resetForm() {
    setEditingId(null);
    setPreview("");

    setForm({
      name: "",
      brand: "",
      review: "",
      rating: 5,
      image_url: "",
    });
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

      <div className="min-h-screen bg-[#FFFFF0] text-white py-10 px-5">
        <div className="max-w-6xl mx-auto">
          <BackButton />

          <p className="uppercase tracking-[5px] text-[#A47764] text-xs mb-2">
            Admin Panel
          </p>

          <h1 className="text-4xl text-[#A47764] font-serif mb-8">
            Testimonials Editor
          </h1>

          <div className="bg-[#161616] rounded-[30px] border border-[#A47764] p-6 space-y-6">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Customer Name"
              className="w-full bg-[#242424] rounded-xl p-4 outline-none"
            />

            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand Name"
              className="w-full bg-[#242424] rounded-xl p-4 outline-none"
            />

            <textarea
              name="review"
              value={form.review}
              onChange={handleChange}
              rows={5}
              placeholder="Write customer's review..."
              className="w-full bg-[#242424] rounded-xl p-4 outline-none resize-none"
            />

            <div>
              <label className="text-[#A47764] text-sm block mb-2">
                Rating
              </label>

              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="w-full bg-[#242424] rounded-xl p-4 outline-none"
              >
                {[5, 4, 3, 2, 1].map((star) => (
                  <option key={star} value={star}>
                    {star} Star
                  </option>
                ))}
              </select>
            </div>

            <label className="cursor-pointer bg-[#A47764] hover:bg-[#B47C68] rounded-full py-3 flex justify-center items-center gap-3 font-semibold transition">
              <FaUpload />
              Upload Customer Photo

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
            </label>

            {preview && (
              <div className="flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-36 h-36 rounded-full object-cover border-4 border-[#A47764]"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={saveTestimonial}
                disabled={loading}
                className="flex-1 bg-[#A47764] hover:bg-[#B47C68]  py-4 rounded-full font-semibold flex justify-center items-center gap-3 disabled:opacity-50 transition"
              >
                <FaSave />
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Testimonial"
                    : "Save Testimonial"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="flex-1 border border-[#A47764] text-[#A47764] hover:bg-[#B47C68]  hover:text-white py-4 rounded-full transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <h2 className="text-3xl font-serif mt-12 mb-6">
            Saved Testimonials ({testimonials.length})
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-[#161616] rounded-[28px] border border-[#B47C68]  p-5"
              >
                <div className="flex items-center gap-4">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}

                  <div>
                    <h3 className="font-semibold text-lg">
                      {item.name}
                    </h3>

                    <p className="text-[#A47764] text-sm">
                      {item.brand}
                    </p>

                    <div className="flex mt-1 gap-1">
                      {Array.from({ length: item.rating || 5 }).map(
                        (_, index) => (
                          <FaStar
                            key={index}
                            className="text-yellow-400"
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 leading-7 mt-5">
                  {item.review}
                </p>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => editTestimonial(item)}
                    className="flex-1 bg-[#B47C68]  hover:bg-[#B47C68] py-3 rounded-full flex justify-center items-center gap-2 transition"
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTestimonial(item)}
                    className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-full flex justify-center items-center gap-2 transition"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}