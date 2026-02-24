# api_star_battle
# 🚀 Galactic Cards

Interactive sci-fi card interface powered by the SWAPI API.

This project dynamically generates collectible-style cards for characters, planets, and starships using live API data.  
Original analog names and designs are mapped to SWAPI responses to create a unique game-like universe.

---

## 🧠 Project Idea

Instead of displaying raw API data, this project transforms it into:

- 🎴 Collectible character cards
- 🚀 Starship battle cards
- 🌍 Planet information cards
- 🟡 Sci-fi themed UI with yellow accent system (#f2e900)

Each server response is mapped to original fictional entities to create a standalone universe.

---

## ⚙️ Tech Stack

- HTML5
- CSS3 (custom UI styling)
- Vanilla JavaScript (ES6+)
- Fetch API
- SWAPI (https://www.swapi.tech)

---

## 🏗 Architecture Highlights

- Modular data mapping (ID → original entity)
- Async data fetching
- Error handling
- Conditional rendering
- Reusable card component logic
- Clean DOM manipulation

---

## 📡 API Integration

Data is fetched dynamically from SWAPI endpoints:

- `/people`
- `/planets`
- `/starships`

Example:

```js
fetch("https://www.swapi.tech/api/starships/12")