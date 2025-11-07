document.addEventListener("DOMContentLoaded", () => {
  loadEvents();

  document.getElementById("search").addEventListener("input", filterEvents);
  document.getElementById("toggle-favorites").addEventListener("click", toggleFavoritesView);
  document.getElementById("categoryFilter").addEventListener("change", filterEvents);
});

let allEvents = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let showingFavorites = false;

/* ---------------------------
   1️⃣ API get data
   ---------------------------  */
async function loadEvents() {
  const url = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/lieux_culturels_touristiques_evenementiels_visitbrussels_vbx/records?limit=100";
  const eventList = document.getElementById("event-list");
  const loading = document.getElementById("loading");

  loading.style.display = "block";
  eventList.innerHTML = "";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("API niet bereikbaar");

    const data = await response.json();
    loading.style.display = "none";

    allEvents = data.results || [];
    displayEvents(allEvents);

  } catch (error) {
    console.error("API niet bereikbaar:", error);
    loading.textContent = "❌ Fout bij het laden van events";
    loading.style.display = "block";
  }
}

/* ---------------------------
   2️⃣ get list DATA
   --------------------------- */
function displayEvents(events) {
  const eventList = document.getElementById("event-list");
  eventList.innerHTML = "";

  if (events.length === 0) {
    eventList.innerHTML = "<p>Geen evenementen gevonden.</p>";
    return;
  }

  events.forEach(item => {
    const fields = item.fields || item;
    const id = item.id;
    const name = fields.translations_nl_name || "Naam onbekend";
    const address = fields.translations_nl_address_line1 || "Adres niet beschikbaar";
    const zip = fields.translations_nl_address_zip || "";
    const commune = fields.add_municipality_nl || fields.add_municipality_fr || "";
    const categories = (fields.visit_category_nl_multi || []).join(", ") || "Categorie onbekend";
    const mapLink = fields.google_maps || "#";

    const badgeClass =
      categories.toLowerCase().includes("monumenten & locaties") ? "category-art" :
      categories.toLowerCase().includes("musea & bezoeken") ? "category-museum" :
      categories.toLowerCase().includes("handwerk") ? "category-handwerk" :
      "category-Default";

    const isFav = favorites.some(fav => fav.id === id);
    const favIcon = isFav ? "⭐" : "☆";

    const card = document.createElement("div");
    card.classList.add("event-card");

    card.innerHTML = `
      <div class="card-top">
        <span class="category-badge ${badgeClass}">${categories}</span>
        <button class="fav-btn" data-id="${id}">${favIcon}</button>
      </div>
      <h3>${name}</h3>
      <p><strong>Adres:</strong> ${address}, ${zip} ${commune}</p>
      <a href="${mapLink}" target="_blank">📍 Zie op Google Maps</a>
    `;

    eventList.appendChild(card);
  });

  document.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", toggleFavorite);
  });
}

// ---------------------------
// 3️⃣ zoeken & categorie
// ---------------------------
function filterEvents() {
  const query = document.getElementById("search").value.toLowerCase();
  const catFilter = document.getElementById("categoryFilter").value.toLowerCase();
  const list = showingFavorites ? favorites : allEvents;

  const filtered = list.filter(item => {
    const f = item.fields || item;
    const name = (f.translations_nl_name || "").toLowerCase();
    const category = (f.visit_category_nl_multi || []).join(" ").toLowerCase();
    const commune = (f.add_municipality_nl || "").toLowerCase();

    const matchesQuery =
      name.includes(query) || category.includes(query) || commune.includes(query);
    const matchesCategory =
      catFilter === "" || category.includes(catFilter);

    return matchesQuery && matchesCategory;
  });

  displayEvents(filtered);
}

// ---------------------------
// 4️⃣ beheren fav list
// ---------------------------
function toggleFavorite(e) {
  const id = e.target.dataset.id;
  const eventItem = allEvents.find(ev => ev.id === id) || favorites.find(f => f.id === id);
  if (!eventItem) return;

  const index = favorites.findIndex(fav => fav.id === id);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(eventItem);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  filterEvents();
}

// ---------------------------
// 5️⃣ veranderen FAV
// ---------------------------
function toggleFavoritesView() {
  showingFavorites = !showingFavorites;
  const btn = document.getElementById("toggle-favorites");

  if (showingFavorites) {
    btn.classList.add("active");
    btn.textContent = "⭐ Toon alles";
    displayEvents(favorites);
  } else {
    btn.classList.remove("active");
    btn.textContent = "⭐ Alleen favorieten";
    displayEvents(allEvents);
  }
}

// Dark Mode Toggle
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  document.getElementById("darkModeToggle").textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Laatste mod openen voor Dark mode wanneer pagina terug te openen
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark");
  document.getElementById("darkModeToggle").textContent = "☀️ Light Mode";
}
