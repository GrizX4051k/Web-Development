document.addEventListener("DOMContentLoaded", () => {
  const chips = Array.from(document.querySelectorAll(".nav-chip"));
  const cards = Array.from(document.querySelectorAll(".project-card"));

  function applyFilter(filter) {
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(",");
      const match = filter === "all" || tags.includes(filter);
      card.style.display = match ? "flex" : "none";
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("nav-chip--active"));
      chip.classList.add("nav-chip--active");
      const filter = chip.dataset.filter || "all";
      applyFilter(filter);
    });
  });

  // Default: show all
  applyFilter("all");
});
