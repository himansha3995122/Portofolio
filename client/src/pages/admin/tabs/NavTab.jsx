import { useState } from "react";
import { useData } from "../../../context/DataContext";
import { api } from "../../../api/client";
import IconButton from "../../../components/IconButton";
import { inputClass, btnClass } from "./formStyles";

export default function NavTab() {
  const { navItems, refetch } = useData();
  const [newLabel, setNewLabel] = useState("");
  const items = [...navItems].sort((a, b) => a.order - b.order);

  async function handleAdd() {
    if (!newLabel.trim()) return;
    await api.addNav(newLabel.trim());
    setNewLabel("");
    refetch("navItems");
  }

  async function handleRename(id, label) {
    await api.patchNav(id, { label });
    refetch("navItems");
  }

  async function handleSwap(a, b) {
    await Promise.all([
      api.patchNav(a.id, { order: b.order }),
      api.patchNav(b.id, { order: a.order }),
    ]);
    refetch("navItems");
  }

  async function handleRemove(id) {
    await api.deleteNav(id);
    refetch("navItems");
  }

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center gap-2.5 border border-line dark:border-line-dark rounded-xl p-2 px-2.5 bg-surface2 dark:bg-surface2-dark"
          >
            <input
              className={`${inputClass} flex-1`}
              defaultValue={item.label}
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (val && val !== item.label) handleRename(item.id, val);
              }}
            />
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
      <div className="flex gap-2 mt-2.5">
        <input
          className={`${inputClass} flex-1`}
          placeholder="New section name"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <button className={btnClass} onClick={handleAdd}>
          Add
        </button>
      </div>
      <p className="text-xs text-dim dark:text-dim-dark mt-2.5 leading-relaxed">
        Removing a section here also removes it from the bottom bar.
      </p>
    </div>
  );
}
