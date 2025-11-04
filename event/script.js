document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
  document.getElementById("search").addEventListener("input", filterEvents);
  document.getElementById("toggle-favorites").addEventListener("click", toggleFavoritesView);
});

let allEvents = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let showingFavorites = false;

async function loadEvents() {
  const url = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/lieux_culturels_touristiques_evenementiels_visitbrussels_vbx/records?limit=50";
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
    console.error("API verisi alınamadı:", error);
    loading.textContent = "❌ Fout bij het laden van events";
    loading.style.display = "block";
  }
}

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
    const name = fields.translations_fr_name || fields.translations_nl_name || "Naam onbekend";
    const address = fields.translations_fr_address_line1 || "Adres niet beschikbaar";
    const zip = fields.translations_fr_address_zip || "";
    const commune = fields.add_municipality_fr || fields.add_municipality_nl || "";
    const category = (fields.visit_category_fr_multi && fields.visit_category_fr_multi[0]) || "Categorie onbekend";
    const mapLink = fields.google_maps || "#";

    const badgeClass =
      category.includes("Art") ? "category-Art" :
      category.includes("Patrimoine") ? "category-Heritage" :
      category.includes("Musée") ? "category-Museum" :
      "category-Default";

    const isFav = favorites.some(fav => fav.id === id);
    const favIcon = isFav ? "⭐" : "☆";

    const card = document.createElement("div");
    card.classList.add("event-card");

    card.innerHTML = `
      <div class="card-top">
        <span class="category-badge ${badgeClass}">${category}</span>
        <button class="fav-btn" data-id="${id}">${favIcon}</button>
      </div>
      <h3>${name}</h3>
      <p><strong>Adres:</strong> ${address}, ${zip} ${commune}</p>
      <a href="${mapLink}" target="_blank">📍 View on Google Maps</a>
    `;

    eventList.appendChild(card);
  });

  document.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", toggleFavorite);
  });
}

function filterEvents() {
  const query = document.getElementById("search").value.toLowerCase();
  const list = showingFavorites ? favorites : allEvents;

  const filtered = list.filter(item => {
    const f = item.fields || item;
    const name = (f.translations_fr_name || f.translations_nl_name || "").toLowerCase();
    const category = (f.visit_category_fr_multi && f.visit_category_fr_multi[0] || "").toLowerCase();
    return name.includes(query) || category.includes(query);
  });

  displayEvents(filtered);
}

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
