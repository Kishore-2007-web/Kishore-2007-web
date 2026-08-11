const fs = require("fs");

// Load and update game state
const stateFile = "game-state.json";
let state = {
  visits: 0,
  pet: { hunger: 5, happiness: 5 },
  quotes: [
    "Keep coding, the bugs fear you.",
    "Every PR is a step closer to mastery.",
    "404: Motivation not found, but you're still going."
  ]
};

if (fs.existsSync(stateFile)) {
  try {
    state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  } catch (e) {
    console.error("Failed to parse game-state.json, using defaults");
  }
}

state.visits = (state.visits || 0) + 1;
state.pet = state.pet || { hunger: 5, happiness: 5 };
state.pet.hunger = Math.max(0, (state.pet.hunger ?? 5) - 1);
state.pet.happiness = Math.min(10, (state.pet.happiness ?? 5) + 1);

const quotes = state.quotes && state.quotes.length > 0 ? state.quotes : ["Keep coding, the bugs fear you."];
const quote = quotes[Math.floor(Math.random() * quotes.length)];
fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));

// Helper for visual progress bar
const makeBar = (val, max = 10) => {
  const filled = Math.min(max, Math.max(0, val));
  return "🟩".repeat(filled) + "⬜".repeat(max - filled);
};

const petMood =
  state.pet.hunger <= 2
    ? "🤤 Hungry & wanting snacks!"
    : state.pet.happiness >= 8
    ? "🥳 Super energetic & happy!"
    : "😊 Chilling happily!";

const gameSection = `<!-- LIVING-GAME:START -->
<div align="center">

### 🐾 Living Profile Pet & Daily Motivation 🧸

> *" ${quote} "*

| 🧠 Profile Visits | 🐶 Pet Mood | 🍖 Hunger | 💖 Happiness |
| :---: | :---: | :---: | :---: |
| **${state.visits}** | ${petMood} | ${makeBar(state.pet.hunger)} (${state.pet.hunger}/10) | ${makeBar(state.pet.happiness)} (${state.pet.happiness}/10) |

<br/>

<a href="https://github.com/Kishore-2007-web/Kishore-2007-web/issues/new?title=Feed+the+pet">
  <img src="https://img.shields.io/badge/🍖_Feed_Pet-Open_Issue-orange?style=for-the-badge" alt="Feed Pet" />
</a>
&nbsp;
<a href="https://github.com/Kishore-2007-web/Kishore-2007-web/issues/new?title=Play+with+pet">
  <img src="https://img.shields.io/badge/🎾_Play_With_Pet-Open_Issue-brightgreen?style=for-the-badge" alt="Play" />
</a>

<br/>
<sub>🔁 Automatically updated hourly via GitHub Actions</sub>

</div>
<!-- LIVING-GAME:END -->`;

// Update README.md targeting only the game section
const readmePath = "README.md";
let readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf8") : "";
const startTag = "<!-- LIVING-GAME:START -->";
const endTag = "<!-- LIVING-GAME:END -->";

if (readme.includes(startTag) && readme.includes(endTag)) {
  const before = readme.substring(0, readme.indexOf(startTag));
  const after = readme.substring(readme.indexOf(endTag) + endTag.length);
  readme = `${before}${gameSection}${after}`;
} else {
  readme = `${gameSection}\n\n${readme}`;
}

fs.writeFileSync(readmePath, readme);
console.log("README and game-state updated successfully!");
