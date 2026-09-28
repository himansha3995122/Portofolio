import { useState } from "react";
import { useData } from "../../../context/DataContext";
import { api } from "../../../api/client";
import IconButton from "../../../components/IconButton";
import { inputClass, textareaClass, btnPrimaryClass, btnClass } from "./formStyles";

const emptyForm = { title: "", author: "", status: "Want to read", rating: "0", notes: "" };

export default function BooksTab() {
  const { books, refetch } = useData();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [cover, setCover] = useState(null);
  const items = [...books].sort((a, b) => a.order - b.order);

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      author: item.author || "",
      status: item.status || "Want to read",
      rating: String(item.rating || "0"),
      notes: item.notes || "",
    });
    setCover(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setCover(null);
  }

  async function handleSubmit() {
    if (!form.title.trim()) return;
    const body = {
      title: form.title.trim(),
      author: form.author.trim(),
      status: form.status,
      rating: form.rating,
      notes: form.notes.trim(),
    };
    if (editingId) {
      await api.patchCollectionItem("books", editingId, body, cover);
    } else {
      await api.addCollectionItem("books", body, cover);
    }
    cancelEdit();
    refetch("books");
  }

  async function handleSwap(a, b) {
    await Promise.all([
      api.patchCollectionItem("books", a.id, { order: b.order }),
      api.patchCollectionItem("books", b.id, { order: a.order }),
    ]);
    refetch("books");
  }

  async function handleRemove(id) {
    if (editingId === id) cancelEdit();
    await api.deleteCollectionItem("books", id);
    refetch("books");
  }

  return (
    <div>
      <div className="border border-line dark:border-line-dark rounded-xl p-3.5 bg-surface2 dark:bg-surface2-dark mb-4 flex flex-col gap-2.5">
        <input className={inputClass} placeholder="Book title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className={inputClass} placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
        <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Want to read</option>
          <option>Reading</option>
          <option>Read</option>
        </select>
        <select className={inputClass} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
          <option value="0">No rating</option>
          <option value="1">★☆☆☆☆</option>
          <option value="2">★★☆☆☆</option>
          <option value="3">★★★☆☆</option>
          <option value="4">★★★★☆</option>
          <option value="5">★★★★★</option>
        </select>
        <textarea
          className={`${textareaClass} min-h-[64px]`}
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <label className="text-xs text-dim dark:text-dim-dark">
          {editingId ? "Replace cover image (optional)" : "Cover image (optional)"}
          <input
            type="file"
            accept="image/*"
            className="block mt-1 text-xs"
            onChange={(e) => setCover(e.target.files?.[0] || null)}
          />
        </label>
        <div className="flex gap-2">
          <button className={`${btnPrimaryClass} self-start`} onClick={handleSubmit}>
            {editingId ? "Save changes" : "Add book"}
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
                {item.author} · {item.status}
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
