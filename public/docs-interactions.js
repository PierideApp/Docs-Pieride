(() => {
  const root = document.documentElement;
  const normalize = (value) => (value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();

  function syncThemePictures() {
    const dark = root.dataset.theme === "dark";
    document.querySelectorAll('picture > source[media*="prefers-color-scheme: dark"], picture > source[data-app-theme-source]').forEach((source) => {
      if (!source.hasAttribute("data-app-theme-source")) source.setAttribute("data-app-theme-source", "dark");
      source.media = dark ? "all" : "not all";
    });
  }

  function searchDialog() { return document.querySelector("[data-search-dialog]"); }
  function searchInput() { return document.querySelector("[data-search-input]"); }
  function visibleResults() {
    return [...document.querySelectorAll("[data-search-result]")].filter((item) => !item.hidden);
  }
  function refreshSearch() {
    const dialog = searchDialog();
    const input = searchInput();
    if (!dialog || !input) return;
    const term = normalize(input.value);
    const items = [...dialog.querySelectorAll("[data-search-result]")];
    let shown = 0;
    for (const item of items) {
      const matches = !term || normalize(item.getAttribute("data-search-text")).includes(term);
      const inLimit = term ? shown < 12 : shown < 6;
      item.hidden = !matches || !inLimit;
      item.classList.remove("active");
      if (matches && inLimit) shown += 1;
    }
    const empty = dialog.querySelector("[data-search-empty]");
    if (empty) empty.hidden = shown !== 0;
    const first = visibleResults()[0];
    if (first) first.classList.add("active");
  }
  function openSearch() {
    const dialog = searchDialog();
    const input = searchInput();
    if (!dialog || !input) return;
    dialog.hidden = false;
    input.value = "";
    refreshSearch();
    requestAnimationFrame(() => input.focus());
  }
  function closeSearch() {
    const dialog = searchDialog();
    if (dialog) dialog.hidden = true;
  }
  function setMenu(open) {
    document.querySelector(".sidebar")?.classList.toggle("mobile-open", open);
    const scrim = document.querySelector("[data-menu-close]");
    if (scrim) scrim.hidden = !open;
  }



  syncThemePictures();
  new MutationObserver(syncThemePictures).observe(root, { attributes: true, attributeFilter: ["data-theme"], childList: true, subtree: true });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target.closest("[data-search-open]")) { openSearch(); return; }
    if (target.closest("[data-menu-open]")) { setMenu(true); return; }
    if (target.closest("[data-menu-close]")) { setMenu(false); return; }
    const categoryButton = target.closest("[data-category-toggle]");
    if (categoryButton) {
      const section = categoryButton.closest("[data-sidebar-category]");
      const pages = section?.querySelector("[data-sidebar-pages]");
      if (!section || !pages) return;
      const open = pages.hidden;
      pages.hidden = !open;
      section.classList.toggle("expanded", open);
      categoryButton.setAttribute("aria-expanded", String(open));
      const name = section.querySelector(".sidebar-category-name")?.textContent || "catégorie";
      categoryButton.setAttribute("aria-label", (open ? "Réduire " : "Développer ") + name);
      return;
    }
    if (target.matches("[data-search-dialog]")) { closeSearch(); return; }
    if (target.closest("[data-search-result]")) { closeSearch(); return; }
    if (target.closest(".sidebar a")) setMenu(false);
  });

  document.addEventListener("input", (event) => {
    if (event.target instanceof Element && event.target.matches("[data-search-input]")) refreshSearch();
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (searchDialog()?.hidden !== false) openSearch(); else closeSearch();
      return;
    }
    const dialog = searchDialog();
    if (!dialog || dialog.hidden) return;
    if (event.key === "Escape") { event.preventDefault(); closeSearch(); return; }
    const results = visibleResults();
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!results.length) return;
      event.preventDefault();
      let active = results.findIndex((item) => item.classList.contains("active"));
      active = (active + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length;
      results.forEach((item, index) => item.classList.toggle("active", index === active));
    } else if (event.key === "Enter" && results.length) {
      event.preventDefault();
      results.find((item) => item.classList.contains("active"))?.click();
    }
  });
})();
