import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { FaSave } from "react-icons/fa";
import BackButton from "./BackButton";
import Dialog from "../components/Dialog";

const EMPTY_FORM = {
  likes: "",
  comments: "",
  shares: "",
  saves: "",
  views: "",
  growth: "",
  service1: "",
  service2: "",
  service3: "",
  service4: "",
  service5: "",
  service6: "",
};

export default function ResultServicesEditor() {
  const [saving, setSaving] = useState(false);
  const [rowId, setRowId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

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
        setDialog((previous) => ({ ...previous, open: false }));
      }, 2500);
    }
  }

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    const { data, error } = await supabase
      .from("result_services")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1);

    if (error) {
      console.error("Failed to load Results & Services:", error);
      showDialog("error", "Unable to Load", error.message);
      return;
    }

    if (data && data.length > 0) {
      const record = data[0];

      setRowId(record.id);
      setForm({
        likes: record.likes ?? "",
        comments: record.comments ?? "",
        shares: record.shares ?? "",
        saves: record.saves ?? "",
        views: record.views ?? "",
        growth: record.growth ?? "",
        service1: record.service1 ?? "",
        service2: record.service2 ?? "",
        service3: record.service3 ?? "",
        service4: record.service4 ?? "",
        service5: record.service5 ?? "",
        service6: record.service6 ?? "",
      });
    } else {
      setRowId(null);
      setForm(EMPTY_FORM);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function saveChanges() {
    if (saving) return;

    setSaving(true);

    try {
      let result;

      if (rowId !== null) {
        result = await supabase
          .from("result_services")
          .update(form)
          .eq("id", rowId)
          .select()
          .maybeSingle();
      } else {
        result = await supabase
          .from("result_services")
          .insert([form])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      if (!result.data) {
        throw new Error(
          "No record was returned. Check your Supabase permissions."
        );
      }

      setRowId(result.data.id);

      setForm({
        likes: result.data.likes ?? "",
        comments: result.data.comments ?? "",
        shares: result.data.shares ?? "",
        saves: result.data.saves ?? "",
        views: result.data.views ?? "",
        growth: result.data.growth ?? "",
        service1: result.data.service1 ?? "",
        service2: result.data.service2 ?? "",
        service3: result.data.service3 ?? "",
        service4: result.data.service4 ?? "",
        service5: result.data.service5 ?? "",
        service6: result.data.service6 ?? "",
      });

      showDialog(
        "success",
        "Changes Saved!",
        "Your Results & Services have been saved successfully.",
        true
      );
    } catch (error) {
      console.error("Save failed:", error);
      showDialog("error", "Save Failed", error.message);
    } finally {
      setSaving(false);
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
          setDialog((previous) => ({
            ...previous,
            open: false,
          }))
        }
      />

      <div className="min-h-screen bg-black text-white px-5 py-10">
        <BackButton />

        <div className="max-w-5xl mx-auto">
          <p className="uppercase tracking-[5px] text-[#A47764] text-xs mb-2">
            Admin Panel
          </p>

          <h1 className="text-4xl font-serif mb-10">
            Results & Services Editor
          </h1>

          <div className="bg-[#161616] rounded-[30px] border border-[#A47764] p-6 mb-10">
            <h2 className="text-2xl font-serif text-[#A47764] mb-6">
              Campaign Results
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <Input label="Likes" name="likes" value={form.likes} onChange={handleChange} />
              <Input label="Comments" name="comments" value={form.comments} onChange={handleChange} />
              <Input label="Shares" name="shares" value={form.shares} onChange={handleChange} />
              <Input label="Saves" name="saves" value={form.saves} onChange={handleChange} />
              <Input label="Views" name="views" value={form.views} onChange={handleChange} />
              <Input label="Average Growth" name="growth" value={form.growth} onChange={handleChange} />
            </div>
          </div>

          <div className="bg-[#161616] rounded-[30px] border border-[#A47764] p-6">
            <h2 className="text-2xl font-serif text-[#A47764] mb-6">
              Services
            </h2>

            <div className="grid gap-5">
              <Input label="Service 1" name="service1" value={form.service1} onChange={handleChange} />
              <Input label="Service 2" name="service2" value={form.service2} onChange={handleChange} />
              <Input label="Service 3" name="service3" value={form.service3} onChange={handleChange} />
              <Input label="Service 4" name="service4" value={form.service4} onChange={handleChange} />
              <Input label="Service 5" name="service5" value={form.service5} onChange={handleChange} />
              <Input label="Service 6" name="service6" value={form.service6} onChange={handleChange} />
            </div>

            <button
              type="button"
              onClick={saveChanges}
              disabled={saving}
              className="w-full mt-8 bg-[#A47764] hover:bg-[#382B24] py-4 rounded-full font-semibold flex items-center justify-center gap-3 disabled:opacity-50 transition"
            >
              <FaSave />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[#A47764] text-sm mb-2 uppercase tracking-[2px]"
      >
        {label}
      </label>

      <input
        id={name}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#242424] text-white rounded-xl p-4 outline-none border border-transparent focus:border-[#A47764]"
      />
    </div>
  );
}