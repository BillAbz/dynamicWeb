# 🎨 Brussels Culture Explorer

Een interactieve webapplicatie waarmee gebruikers culturele evenementen en toeristische locaties in Brussel kunnen ontdekken via de **Open Data Brussels API**.  
De app ondersteunt zoeken, filteren, favorieten opslaan en een donkere modus 🌙.

---

## 🚀 Functionaliteiten

✅ **API Integratie**
- Data afkomstig van [Open Data Brussels](https://opendata.brussels.be/pages/home/)
- Gebruikt datasets zoals *"lieux_culturels_touristiques_evenementiels_visitbrussels_vbx"*

✅ **Zoek- en Filterfunctie**
- Zoek op naam of locatie  
- Filter resultaten op categorie of type (optioneel)

✅ **Favorieten**
- Voeg evenementen toe aan favorieten met één klik ❤️  
- Favorieten worden opgeslagen in `localStorage`

✅ **Dark Mode**
- Schakel tussen Light en Dark Mode 🌞🌙  
- De voorkeur wordt onthouden met `localStorage`

✅ **Responsieve Interface**
- Flexibele grid-layout voor kaarten  
- Werkt goed op desktop, tablet en mobiel

✅ **Animaties**
- Kaarten laden met een zachte fade-in-animatie

---

## 🧠 Gebruikte Technologieën

| Technologie | Functie |
|--------------|----------|
| **HTML5** | Structuur van de applicatie |
| **CSS3 (Flex + Grid)** | Styling, dark mode & animaties |
| **JavaScript (ES6)** | Data ophalen, filteren en interacties |
| **Open Data Brussels API** | Externe dataset met evenementen |

---

## 🔗 Gebruikte API’s

**Hoofd API:**  
`https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/lieux_culturels_touristiques_evenementiels_visitbrussels_vbx/records?limit=50`


**WEBSITE API:** 
[text](https://bruxellesdata.opendatasoft.com/explore/dataset/lieux_culturels_touristiques_evenementiels_visitbrussels_vbx/api/?utm_source=chatgpt.com&disjunctive.visit_category_en_multi&disjunctive.translations_fr_address_zip&disjunctive.add_municipality_fr&disjunctive.pmr_en&disjunctive.accessibilities_translations_en_item)

📘 [Bekijk de API-documentatie](https://opendata.brussels.be/pages/home/)

---

## ⚙️ Installatiehandleiding

1. **Clone de repository**
   ```bash
   git clone https://github.com/BillAbz/dynamicWeb.git
   cd dynamicWeb
