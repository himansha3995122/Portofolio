import { useState } from "react";
import { useData } from "../../../context/DataContext";
import { api } from "../../../api/client";
import IconButton from "../../../components/IconButton";
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from "../../../utils/youtube";
import { inputClass, btnPrimaryClass } from "./formStyles";

export default function VisualsTab() {
  const { visuals, refetch } = useData();
  const [mediaType, setMediaType] = useState("photo");
  const [category, setCategory] = useState("Photography");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [note, setNote] = useState("");
  const items = [...visuals].sort((a, b) => a.order - b.order);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNote("Uploading…");
    try {
      await api.addCollectionItem("visuals", { category, title, caption }, file);
      setTitle("");
      setCaption("");
      e.target.value = "";
      await refetch("visuals");
      setNote("Added.");
      setTimeout(() => setNote(""), 2000);
    } catch (err) {
      setNote(err.message);
    }
  }

  async function handleAddVideo() {
    if (!getYouTubeEmbedUrl(videoUrl)) {
      setNote("Enter a valid YouTube URL.");
      return;
    }
    setNote("Adding…");
    try {
      await api.addCollectionItem("visuals", { category, title, caption, videoUrl: videoUrl.trim() });
      setTitle("");
      setCaption("");
      setVideoUrl("");
      await refetch("visuals");
      setNote("Added.");
      setTimeout(() => setNote(""), 2000);
    } catch (err) {
      setNote(err.message);
    }
  }

  async function handleSwap(a, b) {
    await Promise.all([
      api.patchCollectionItem("visuals", a.id, { order: b.order }),
      api.patchCollectionItem("visuals", b.id, { order: a.order }),
    ]);
    refetch("visuals");
  }

  async function handleRemove(id) {
    await api.deleteCollectionItem("visuals", id);
    refetch("visuals");
  }

  return (
    <div>
      <div className="border border-line dark:border-line-dark rounded-xl p-3.5 bg-surface2 dark:bg-surface2-dark mb-4">
        <div className="flex gap-1.5 mb-2.5">
          <button
            className={`${mediaType === "photo" ? btnPrimaryClass : inputClass} flex-1 text-center`}
            onClick={() => setMediaType("photo")}
          >
            Photo
          </button>
          <button
            className={`${mediaType === "video" ? btnPrimaryClass : inputClass} flex-1 text-center`}
            onClick={() => setMediaType("video")}
          >
            YouTube video
          </button>
        </div>
        <select className={`${inputClass} mb-2.5`} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Photography">Photography</option>
          <option value="VJ Set">VJ Set</option>
        </select>
        <input className={`${inputClass} mb-2.5`} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input
          className={`${inputClass} mb-2.5`}
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        {mediaType === "photo" ? (
          <label className={`${btnPrimaryClass} cursor-pointer inline-block`}>
            Upload &amp; add
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
        ) : (
          <div className="flex gap-2.5 items-center">
            <input
              className={inputClass}
              placeholder="YouTube URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <button className={`${btnPrimaryClass} flex-none`} onClick={handleAddVideo}>
              Add
            </button>
          </div>
        )}
        <span className="text-xs text-dim dark:text-dim-dark ml-2.5">{note}</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center gap-2.5 border border-line dark:border-line-dark rounded-xl p-2 bg-surface2 dark:bg-surface2-dark"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-bg dark:bg-bg-dark flex-none">
              <img src={item.videoUrl ? getYouTubeThumbnail(item.videoUrl) : item.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{item.title || "Untitled"}</div>
              <div className="text-[11px] font-mono text-dim dark:text-dim-dark">
                {item.category}
                {item.videoUrl ? " · Video" : ""}
              </div>
            </div>
            <div className="flex gap-1.5 flex-none">
              <IconButton label="↑" title="Move up" disabled={idx === 0} onClick={() => handleSwap(item, items[idx - 1])} />
              <IconButton
                label="↓"
                title="Move down"
                disabled={idx === items.length - 1}
                onClick={() => handleSwap(item, items[idx + 1])}
              />
              <IconButton label="✕" title="Remove" onClick={() => handleRemove(item.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
