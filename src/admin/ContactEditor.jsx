import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import BackButton from "./BackButton";
import Dialog from "../components/Dialog";
import { FaSave, FaTrash } from "react-icons/fa";

export default function ContactEditor() {
  const [rowId, setRowId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [contact, setContact] = useState({
    email: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
    location: "",
  });

  // Dialog State
  const [dialog, setDialog] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  // Delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState(false);

  function showDialog(type, title, message, autoClose = false) {
    setDialog({
      open: true,
      type,
      title,
      message,
    });

    if (autoClose) {
      setTimeout(() => {
        setDialog((prev) => ({ ...prev, open: false }));
      }, 2500);
    }
  }

  useEffect(() => {
    fetchContact();
  }, []);

  // Fetch contact info
  async function fetchContact() {
    const { data, error } = await supabase
      .from("contact")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error(error);
      showDialog(
        "error",
        "Unable to Load",
        "Failed to load contact information."
      );
      return;
    }

    if (data.length > 0) {
      const info = data[0];

      setRowId(info.id);

      setContact({
        email: info.email || "",
        phone: info.phone || "",
        whatsapp: info.whatsapp || "",
        instagram: info.instagram || "",
        tiktok: info.tiktok || "",
        location: info.location || "",
      });
    }
  }

  function handleChange(e) {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  }

  // Save Contact
  async function saveContact() {
    setLoading(true);

    try {
      let error;

      if (rowId) {
        ({ error } = await supabase
          .from("contact")
          .update(contact)
          .eq("id", rowId));
      } else {
        const { data, error: insertError } = await supabase
          .from("contact")
          .insert([contact])
          .select();

        error = insertError;

        if (data && data.length > 0) {
          setRowId(data[0].id);
        }
      }

      if (error) throw error;

      showDialog(
        "success",
        "Contact Updated ✨",
        "Your contact information has been updated successfully.",
        true
      );

      fetchContact();
    } catch (err) {
      console.error(err);

      showDialog(
        "error",
        "Update Failed",
        err.message
      );
    } finally {
      setLoading(false);
    }
  }

  // Ask before deleting
  function deleteContact() {
    if (!rowId) {
      showDialog(
        "warning",
        "No Contact Found",
        "There is no contact information to delete."
      );
      return;
    }

    setConfirmDelete(true);
  }

  // Confirm delete
  async function confirmDeleteContact() {
    const { error } = await supabase
      .from("contact")
      .delete()
      .eq("id", rowId);

    if (error) {
      showDialog(
        "error",
        "Delete Failed",
        error.message
      );
      setConfirmDelete(false);
      return;
    }

    setRowId(null);

    setContact({
      email: "",
      phone: "",
      whatsapp: "",
      instagram: "",
      tiktok: "",
      location: "",
    });

    setConfirmDelete(false);

    showDialog(
      "success",
      "Contact Deleted 🗑️",
      "Contact information has been deleted successfully.",
      true
    );
  }

  return (
    <>
      {/* Success / Error Dialog */}
      <Dialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog({ ...dialog, open: false })}
      />

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] px-5">
          <div className="bg-[#171717] w-full max-w-md rounded-[30px] border border-red-500/20 p-8 text-center">
            <FaTrash className="text-red-400 text-6xl mx-auto mb-5" />

            <h2 className="text-white text-3xl font-serif mb-3">
              Delete Contact?
            </h2>

            <p className="text-gray-300 leading-7 mb-8">
              This will permanently remove all contact information from your
              portfolio.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 rounded-full border border-gray-500 text-white hover:bg-gray-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteContact}
                className="flex-1 py-3 rounded-full bg-red-500 hover:bg-red-400 font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#FFFFF0] text-white py-10 px-5">
        <div className="max-w-4xl mx-auto">
          <BackButton />

          <p className="uppercase tracking-[5px] text-[#A47764] text-xs mb-2">
            Admin Panel
          </p>

          <h1 className="text-4xl text-[#A47764] font-serif mb-8">
            Contact Information
          </h1>

          <div className="bg-[#161616] rounded-[30px] border border-[#A47764] p-6 space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={contact.email}
              onChange={handleChange}
              className="w-full bg-[#242424] p-4 rounded-xl outline-none"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={contact.phone}
              onChange={handleChange}
              className="w-full bg-[#242424] p-4 rounded-xl outline-none"
            />

            <input
              type="text"
              name="whatsapp"
              placeholder="WhatsApp Number (2348012345678)"
              value={contact.whatsapp}
              onChange={handleChange}
              className="w-full bg-[#242424] p-4 rounded-xl outline-none"
            />

            <input
              type="text"
              name="instagram"
              placeholder="Instagram Username (without @)"
              value={contact.instagram}
              onChange={handleChange}
              className="w-full bg-[#242424] p-4 rounded-xl outline-none"
            />

            <input
              type="text"
              name="tiktok"
              placeholder="TikTok Username (without @)"
              value={contact.tiktok}
              onChange={handleChange}
              className="w-full bg-[#242424] p-4 rounded-xl outline-none"
            />

            <input
              type="text"
              name="location"
              placeholder="Location (e.g. Lagos, Nigeria)"
              value={contact.location}
              onChange={handleChange}
              className="w-full bg-[#242424] p-4 rounded-xl outline-none"
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={saveContact}
                disabled={loading}
                className="flex-1 bg-[#A47764] hover:bg-[#382B24]  py-4 rounded-full font-semibold flex items-center justify-center gap-3 disabled:opacity-50 transition"
              >
                <FaSave />
                {loading ? "Saving..." : "Save Contact"}
              </button>

              <button
                onClick={deleteContact}
                className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-full font-semibold flex items-center justify-center gap-3 transition"
              >
                <FaTrash />
                Delete Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}