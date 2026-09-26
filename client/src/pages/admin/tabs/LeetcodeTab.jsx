import { useState } from "react";
import { useData } from "../../../context/DataContext";
import { api } from "../../../api/client";
import IconButton from "../../../components/IconButton";
import { inputClass, textareaClass, btnPrimaryClass } from "./formStyles";

export default function LeetcodeTab() {
  const { leetcode, refetch } = useData();
  const [form, setForm] = useState({ title: "", difficulty: "Easy", link: "", notes: "" });
  const items = [...leetcode].sort((a, b) => a.order - b.order);

  async function handleAdd() {
    if (!form.title.trim()) return;
    await api.addCollectionItem("leetcode", {
      title: form.title.trim(),
      difficulty: form.difficulty,
      link: form.link.trim(),
      notes: form.notes.trim(),
    });
    setForm({ title: "", difficulty: "Easy", link: "", notes: "" });
    refetch("leetcode");
  }

  async function handleSwap(a, b) {
    await Promise.all([
      api.patchCollectionItem("leetcode", a.id, { order: b.order }),
      api.patchCollectionItem("leetcode", b.id, { order: a.order }),
    ]);
    refetch("leetcode");
  }

  async function handleRemove(id) {
    await api.deleteCollectionItem("leetcode", id);
    refetch("leetcode");
  }

  return (
    <div>
      <div className="border border-line dark:border-line-dark rounded-xl p-3.5 bg-surface2 dark:bg-surface2-dark mb-4 flex flex-col gap-2.5">
        <input className={inputClass} placeholder="Problem title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <select className={inputClass} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <input className={inputClass} placeholder="Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        <textarea
          className={`${textareaClass} min-h-[64px]`}
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button className={`${btnPrimaryClass} self-start`} onClick={handleAdd}>
          Add problem
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
              <div className="text-[11px] font-mono text-dim dark:text-dim-dark">{item.difficulty}</div>
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
