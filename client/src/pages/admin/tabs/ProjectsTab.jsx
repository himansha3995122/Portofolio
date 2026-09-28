import { useState } from "react";
import { useData } from "../../../context/DataContext";
import { api } from "../../../api/client";
import IconButton from "../../../components/IconButton";
import { inputClass, textareaClass, btnPrimaryClass, btnClass } from "./formStyles";

const emptyForm = { title: "", description: "", link: "", tags: "" };

export default function ProjectsTab() {
  const { projects, refetch } = useData();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const items = [...projects].sort((a, b) => a.order - b.order);

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      link: item.link || "",
      tags: (item.tags || []).join(", "),
    });
    setImage(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setImage(null);
  }

  async function handleSubmit() {
    if (!form.title.trim()) return;
    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      link: form.link.trim(),
      tags: form.tags,
    };
    if (editingId) {
      await api.patchCollectionItem("projects", editingId, body, image);
    } else {
      await api.addCollectionItem("projects", body, image);
    }
    cancelEdit();
    refetch("projects");
  }

  async function handleSwap(a, b) {
    await Promise.all([
      api.patchCollectionItem("projects", a.id, { order: b.order }),
      api.patchCollectionItem("projects", b.id, { order: a.order }),
    ]);
    refetch("projects");
  }

  async function handleRemove(id) {
    if (editingId === id) cancelEdit();
    await api.deleteCollectionItem("projects", id);
    refetch("projects");
  }

  return (
    <div>
      <div className="border border-line dark:border-line-dark rounded-xl p-3.5 bg-surface2 dark:bg-surface2-dark mb-4 flex flex-col gap-2.5">
        <input className={inputClass} placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea
          className={`${textareaClass} min-h-[64px]`}
          placeholder="Short description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input className={inputClass} placeholder="Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        <input
          className={inputClass}
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <label className="text-xs text-dim dark:text-dim-dark">
          {editingId ? "Replace image (optional)" : "Image (optional)"}
          <input
            type="file"
            accept="image/*"
            className="block mt-1 text-xs"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </label>
        <div className="flex gap-2">
          <button className={`${btnPrimaryClass} self-start`} onClick={handleSubmit}>
            {editingId ? "Save changes" : "Add project"}
          </button>
          {editingId && (
            <button className={`${btnClass} self-start`} onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center gap-2.5 border border-line dark:border-line-dark rounded-xl p-2.5 bg-surface2 dark:bg-surface2-dark"
          >
            {item.imageUrl && (
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-bg dark:bg-bg-dark flex-none">
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{item.title}</div>
              <div className="text-[11px] font-mono text-dim dark:text-dim-dark truncate">
                {(item.tags || []).join(", ")}
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
              <IconButton label="✎" title="Edit" onClick={() => startEdit(item)} />
              <IconButton label="✕" title="Remove" onClick={() => handleRemove(item.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
