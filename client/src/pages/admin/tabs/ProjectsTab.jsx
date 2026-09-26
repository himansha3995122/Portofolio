import { useState } from "react";
import { useData } from "../../../context/DataContext";
import { api } from "../../../api/client";
import IconButton from "../../../components/IconButton";
import { inputClass, textareaClass, btnPrimaryClass } from "./formStyles";

export default function ProjectsTab() {
  const { projects, refetch } = useData();
  const [form, setForm] = useState({ title: "", description: "", link: "", tags: "" });
  const items = [...projects].sort((a, b) => a.order - b.order);

  async function handleAdd() {
    if (!form.title.trim()) return;
    await api.addCollectionItem("projects", {
      title: form.title.trim(),
      description: form.description.trim(),
      link: form.link.trim(),
      tags: form.tags,
    });
    setForm({ title: "", description: "", link: "", tags: "" });
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
        <button className={`${btnPrimaryClass} self-start`} onClick={handleAdd}>
          Add project
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center gap-2.5 border border-line dark:border-line-dark rounded-xl p-2.5 bg-surface2 dark:bg-surface2-dark"
          >
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
              <IconButton label="✕" title="Remove" onClick={() => handleRemove(item.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
