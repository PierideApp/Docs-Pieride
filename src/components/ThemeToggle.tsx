"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icons";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    let saved: Theme = "light";
    try {
      if (localStorage.getItem("pieride-docs-theme") === "dark") saved = "dark";
    } catch {}
    document.documentElement.dataset.theme = saved;
    setTheme(saved);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("pieride-docs-theme", next); } catch {}
    setTheme(next);
  }

  const dark = theme === "dark";
  return (
    <button
      className="theme-toggle"
      type="button"
      data-theme-toggle
      aria-label={`Activer le thème ${dark ? "clair" : "sombre"}`}
      title={`Thème ${dark ? "clair" : "sombre"}`}
      aria-pressed={dark}
      onClick={toggleTheme}
    >
      <Icon name={dark ? "sun" : "moon"} size={18} />
      <span>{dark ? "Clair" : "Sombre"}</span>
    </button>
  );
}
