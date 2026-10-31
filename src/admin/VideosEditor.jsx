import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { FaUpload, FaTrash } from "react-icons/fa";
import BackButton from "./BackButton";
import Dialog from "../components/Dialog";

const VIDEO_BUCKET = "portfolio-media";

export default function VideosEditor() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Brand Collaboration");
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [dialog, setDialog] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    getVideos();
  }, []);

  useEffect(() => {
    if (!preview.startsWith("blob:")) return undefined;

    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  // Fetch Videos
  async function getVideos() {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET VIDEOS ERROR:", error);
      return;
    }

    setVideos(data || []);
  }

  // Dialog Helper
  function showDialog(type, title, message, autoClose = false) {
    setDialog({ open: true, type, title, message });

    if (autoClose) {
      setTimeout(() => {
        setDialog((prev) => ({ ...prev, open: false }));
      }, 2500);
    }
  }

  // Pick Video
  function handleUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setVideoFile(file);
    setPreview(URL.createObjectURL(file));
  }

  // Upload Video
  async function saveVideo() {
    if (loading) return;

    if (!title.trim()) {
      showDialog(
        "warning",
        "Title Required",
        "Please enter a title for this video."
      );
      return;
    }

    if (!videoFile) {
      showDialog(
        "warning",
        "Video Required",
        "Please choose a video before saving."
      );
      return;
    }

    setLoading(true);
    let uploadedFileName = null;

    try {
      const fileName = `${Date.now()}-${videoFile.name}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(VIDEO_BUCKET)
        .upload(fileName, videoFile);

      if (uploadError) throw uploadError;
      uploadedFileName = fileName;

      // Get Public URL
      const { data: urlData } = supabase.storage
        .from(VIDEO_BUCKET)
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Save in Database
      const { error: insertError } = await supabase.from("videos").insert({
        title: title.trim(),
        category,
        video_url: publicUrl,
      });

      if (insertError) throw insertError;

      showDialog(
        "success",
        "Video Uploaded 🎉",
        "Your video has been uploaded successfully.",
        true
      );

      // Reset Form
      setTitle("");
      setCategory("Brand Collaboration");
      setVideoFile(null);
      setPreview("");

      await getVideos();
    } catch (error) {
      console.error(error);

      let cleanupError;
      if (uploadedFileName) {
        const { error: storageError } = await supabase.storage
          .from(VIDEO_BUCKET)
          .remove([uploadedFileName]);
        cleanupError = storageError;
        if (cleanupError) console.error("VIDEO UPLOAD CLEANUP ERROR:", cleanupError);
      }

      showDialog(
        "error",
        "Upload Failed",
        cleanupError
          ? `${error.message || "Something went wrong while uploading."} The uploaded file could not be removed from storage: ${cleanupError.message}`
          : error.message || "Something went wrong while uploading."
      );
    } finally {
      setLoading(false);
    }
  }

  // Delete Video
 async function deleteVideo(video) {
  if (deletingId) return;

  setDeletingId(video.id);

  try {
    const { data, error } = await supabase
      .from("videos")
      .delete()
      .eq("id", video.id)
      .select("id");

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error(
        "Supabase did not delete this video. Check the videos table DELETE policy."
      );
    }

    // Remove it from the dashboard only after Supabase confirms deletion.
    setVideos((current) =>
      current.filter((item) => item.id !== video.id)
    );

    showDialog(
      "success",
      "Video Deleted",
      "The video record was deleted from Supabase.",
      true
    );
  } catch (error) {
    console.error("DELETE VIDEO ERROR:", error);

    showDialog(
      "error",
      "Delete Failed",
      error.message || "Unable to delete this video."
    );
  } finally {
    setDeletingId(null);
  }
}

  return (
    <>
      <Dialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog({ ...dialog, open: false })}
      />

      <div className="min-h-screen bg-[#FFFFF0] text-white px-5 py-10">
        <BackButton />

        <div className="max-w-6xl mx-auto">
          <p className="uppercase tracking-[5px] text-[#B47C68] text-xs mb-2">
            Admin Panel
          </p>

          <h1 className="text-4xl text-[#B47C68] font-serif mb-8">Videos Editor</h1>

          {/* Upload Card */}
          <div className="bg-[#161616] rounded-[30px] border border-[#382B24] p-6 space-y-5 mb-12">

            {/* Title */}
            <div>
              <label className="block text-[#B47C68] text-sm uppercase tracking-[2px] mb-2">
                Video Title
              </label>

              <input
                type="text"
                placeholder="e.g. Fenty Foundation Campaign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#242424] rounded-xl p-4 outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[#B47C68] text-sm uppercase tracking-[2px] mb-2">
                Video Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#242424] rounded-xl p-4 outline-none text-white"
              >
                <option>Brand Collaboration</option>
                <option>Beauty</option>
                <option>Lifestyle</option>
                <option>Tech</option>
              </select>
            </div>

            {/* Upload */}
            <label className="flex items-center justify-center gap-3   bg-[#382B24] text-[#FFFFF0] hover:bg-[#A47764] rounded-full py-3 cursor-pointer font-semibold transition">
              <FaUpload />
              Choose Video

              <input
                hidden
                type="file"
                accept="video/*"
                onChange={handleUpload}
              />
            </label>

            {/* Preview */}
            {preview && (
              <div className="flex justify-center">
                <video
                  src={preview}
                  controls
                  className="w-[180px] h-[320px] rounded-[22px] object-cover border border-[#382B24]"
                />
              </div>
            )}

            {/* Save Button */}
            <button
              type="button"
              onClick={saveVideo}
              disabled={loading}
              className="w-full  bg-[#382B24] text-[#FFFFF0] hover:bg-[#A47764] py-4 rounded-full font-semibold disabled:opacity-60 transition"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading Video...
                </div>
              ) : (
                "Save Video"
              )}
            </button>
          </div>

          {/* Uploaded Videos */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-serif">Uploaded Videos</h2>

            <span className="text-[#B47C68] text-sm">
              {videos.length} Video(s)
            </span>
          </div>

          {videos.length === 0 ? (
            <div className="bg-[#161616] rounded-[30px] border border-[#B47C68] py-16 text-center text-gray-500">
              No videos uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-[#161616] rounded-[24px] border border-[#B47C68] p-3"
                >
                  <video
                    src={video.video_url}
                    controls
                    playsInline
                    className="w-full aspect-[9/16] rounded-[18px] object-cover"
                  />

                  {/* Category Badge */}
                  <div className="flex justify-center mt-3">
                    <span className="bg-[#B47C68] border border-[#B47C68]  text-black px-3 py-1 rounded-full text-[10px] uppercase tracking-[2px]">
                      {video.category || "Brand Collaboration"}
                    </span>
                  </div>

                  {/* Title */}
                  <p className="mt-3 text-center uppercase text-[11px] font-semibold tracking-[2px] line-clamp-2">
                    {video.title}
                  </p>

                  {/* Delete */}
                  <button
                    onClick={() => deleteVideo(video)}
                    disabled={deletingId !== null}
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-2 rounded-xl hover:bg-red-500/20 transition"
                  >
                    <FaTrash />
                    {deletingId === video.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}