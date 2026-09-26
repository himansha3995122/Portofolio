import { useEffect, useState } from "react";
import { useData } from "../../../context/DataContext";
import { api } from "../../../api/client";
import { inputClass, textareaClass, btnClass, btnPrimaryClass } from "./formStyles";

function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default function ProfileTab() {
  const { profile, refetch } = useData();
  const [form, setForm] = useState({ name: "", title: "", bio: "", chips: "" });
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm({
      name: profile.name || "",
      title: profile.title || "",
      bio: profile.bio || "",
      chips: (profile.chips || []).join(", "),
    });
  }, [profile]);

  async function handleSave() {
    setBusy(true);
    try {
      await api.updateProfile({
        name: form.name.trim(),
        title: form.title.trim(),
        bio: form.bio.trim(),
        chips: form.chips.split(",").map((s) => s.trim()).filter(Boolean),
      });
      await refetch("profile");
      setNote("Saved.");
      setTimeout(() => setNote(""), 2200);
    } catch (e) {
      setNote(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      await api.uploadProfilePhoto(file);
      await refetch("profile");
    } catch (e) {
      setNote(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3.5 mb-4">
        <div className="w-14 h-14 rounded-xl overflow-hidden border border-line dark:border-line-dark bg-surface2 dark:bg-surface2-dark flex items-center justify-center font-display font-semibold text-accent dark:text-accent-dark flex-none">
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            initials(profile.name)
          )}
        </div>
        <label className={`${btnClass} cursor-pointer`}>
          Upload photo
          <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-mono text-dim dark:text-dim-dark mb-1.5">Name</label>
        <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="mb-4">
        <label className="block text-xs font-mono text-dim dark:text-dim-dark mb-1.5">Title / role</label>
        <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="mb-4">
        <label className="block text-xs font-mono text-dim dark:text-dim-dark mb-1.5">Bio</label>
        <textarea className={textareaClass} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </div>
      <div className="mb-4">
        <label className="block text-xs font-mono text-dim dark:text-dim-dark mb-1.5">Tags (comma separated)</label>
        <input
          className={inputClass}
          value={form.chips}
          onChange={(e) => setForm({ ...form, chips: e.target.value })}
          placeholder="e.g. Backend, Sydney, Open to work"
        />
      </div>

      <div className="flex items-center gap-2.5">
        <button onClick={handleSave} disabled={busy} className={`${btnPrimaryClass} disabled:opacity-60`}>
          Save changes
        </button>
        <span className="text-xs text-dim dark:text-dim-dark">{note}</span>
      </div>
    </div>
  );
}
