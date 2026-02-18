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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form");
  if (!form) return;

  const limitMsg = document.getElementById("feedback-limit-msg");
  const STORAGE_KEY = "feedback_submissions";
  const WINDOW_MS = 48 * 60 * 60 * 1000; // 48 hours
  const MAX_SUBMISSIONS = 2;

  function getSubmissions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      const now = Date.now();
      // keep only timestamps within last 48 hours
      return arr.filter(ts => now - ts < WINDOW_MS);
    } catch {
      return [];
    }
  }

  function saveSubmissions(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function updateLimitMessage() {
    const subs = getSubmissions();
    if (subs.length >= MAX_SUBMISSIONS) {
      limitMsg.textContent =
        "You’ve reached the limit of 2 feedback submissions in 48 hours. Please try again later.";
      limitMsg.style.color = "#f97316";
    } else if (subs.length > 0) {
      limitMsg.textContent =
        `You’ve used ${subs.length}/2 feedback submissions in the last 48 hours.`;
      limitMsg.style.color = "#9ca3af";
    } else {
      limitMsg.textContent = "";
    }
  }

  updateLimitMessage();

  form.addEventListener("submit", (e) => {
    const subs = getSubmissions();
    if (subs.length >= MAX_SUBMISSIONS) {
      e.preventDefault();
      updateLimitMessage();
      return;
    }
    // allow submit, then record timestamp (optimistic)
    subs.push(Date.now());
    saveSubmissions(subs);
    updateLimitMessage();
  });
});


