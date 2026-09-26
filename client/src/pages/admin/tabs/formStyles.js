// Shared Tailwind class strings for admin form controls, so every tab
// looks consistent without repeating the same long className each time.

export const inputClass =
  "w-full px-2.5 py-2 rounded-lg border border-line dark:border-line-dark bg-bg dark:bg-bg-dark text-ink dark:text-ink-dark text-sm";

export const textareaClass = `${inputClass} min-h-[80px] resize-y`;

export const btnClass =
  "px-3.5 py-2 rounded-lg border border-line dark:border-line-dark bg-surface2 dark:bg-surface2-dark text-ink dark:text-ink-dark text-sm hover:border-accent dark:hover:border-accent-dark";

export const btnPrimaryClass =
  "px-3.5 py-2 rounded-lg bg-accent dark:bg-accent-dark border border-accent dark:border-accent-dark text-[#06170d] font-semibold text-sm hover:opacity-90";
