import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { inputClass, btnPrimaryClass } from "./tabs/formStyles";

export default function AdminLogin() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[340px] mt-10">
      <p className="text-dim dark:text-dim-dark mb-4">Enter the admin password to edit this site.</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className={inputClass}
        autoFocus
      />
      <div className="mt-4">
        <button type="submit" disabled={busy} className={`${btnPrimaryClass} disabled:opacity-60`}>
          {busy ? "Checking…" : "Unlock"}
        </button>
      </div>
      {error && <p className="text-hard dark:text-hard-dark text-sm mt-2">{error}</p>}
    </form>
  );
}
