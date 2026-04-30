function getGameCount() {
  const gameCountElement = document.getElementById("gameCount");
  const gameContainer = document.getElementById("gameContainer");
  if (gameCountElement && gameContainer) {
    const visibleItems = Array.from(gameContainer.children).filter(
      (child) => child.style.display !== "none"
    ).length;
    gameCountElement.textContent = visibleItems + " games available.";
  }
}
function gameLoader() {
  const gamePath = "/asset/game/";
  const gamesPath = "games.json";
  const gameContainer = document.getElementById("gameContainer");
  const searchBar = document.getElementById("searchBar");
  if (!gameContainer) return;
  fetch(gamesPath)
    .then((res) => res.json())
    .then((gamesData) => {
      const fragment = document.createDocumentFragment();
      const sortedGameNames = Object.keys(gamesData).sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase())
      );
      sortedGameNames.forEach((gameName) => {
        const gameInfo = gamesData[gameName];
        if (!gameInfo) return;
        const gameDescription = gameInfo[0] || "";
        const gameTags = gameInfo[1] || "";
        const gameElement = document.createElement("div");
        gameElement.id = "gameItem";         
        gameElement.dataset.name = gameName.toLowerCase();
        gameElement.dataset.tags = gameTags.toLowerCase();
        gameElement.dataset.desc = gameDescription.toLowerCase();
        const tagsContainer = document.createElement("div");
        tagsContainer.className = "tagsContainer";
        if (gameTags) {
          const tagList = gameTags.split(',').map(t => t.trim()).filter(t => t);
          tagList.forEach(tagText => {
            const tagElement = document.createElement("span");
            tagElement.id = "tag";
            tagElement.textContent = tagText;
            tagElement.addEventListener("click", (e) => {
              e.stopPropagation();
              if (searchBar) {
                const currentVal = searchBar.value.trim();
                const tagString = `[${tagText}]`;                
                if (!currentVal.includes(tagString)) {
                  const separator = currentVal.length > 0 ? " " : "";
                  searchBar.value = `${currentVal}${separator}${tagString}`;
                  searchBar.dispatchEvent(new Event('input'));
                }
              }
            });
            tagsContainer.appendChild(tagElement);
          });
        }
        gameElement.title = gameDescription;
        const thumbnail = document.createElement("img");
        thumbnail.src = `${gamePath}${gameName}/cover.png`;
        thumbnail.alt = gameName;
        thumbnail.loading = "lazy"; 
        thumbnail.decoding = "async";
        thumbnail.id = "gameThumbnail";
        thumbnail.onerror = () => {
          thumbnail.src = `/asset/ui/missing.svg`;
        };
        const title = document.createElement("h3");
        title.textContent = gameName;
        title.dataset.original = gameName;
        title.id = "gameTitle";
        const description = document.createElement("p");
        description.textContent = gameDescription;
        description.dataset.original = gameDescription;
        description.id = "gameDescription";
        gameElement.addEventListener("click", () => {
          if (typeof Analytics !== "undefined") {
            Analytics.trackGameVisit(gameName);
          }
          window.location.href = `${gamePath}${gameName}/`;
        });
        gameElement.appendChild(thumbnail);
        gameElement.appendChild(title);
        gameElement.appendChild(description);
        gameElement.appendChild(tagsContainer);
        fragment.appendChild(gameElement);
      });
      gameContainer.appendChild(fragment);
      getGameCount();
      setupSearch();
    })
    .catch((error) => {
      console.error("Oops! There was an error loading games: ", error);
      if (typeof notify !== "undefined") {
        window.notify(
          "An error occured loading the games! Check the developer console for more info.",
          "Oh noes!",
          "sad.svg",
          "6000"
        );
      }
    });
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function highlightText(element, query) {
  if (!element) return;
  const original = element.dataset.original || element.textContent;
  if (!query) {
    element.textContent = original;
    return;
  }
  const re = new RegExp(escapeRegExp(query), "gi");
  if (re.test(original)) {
    element.innerHTML = original.replace(re, (match) => `<mark>${match}</mark>`);
  } else {
    element.textContent = original;
  }
}
function setupSearch() {
  const searchBar = document.getElementById("searchBar");
  const gameContainer = document.getElementById("gameContainer");
  if (!searchBar || !gameContainer) return;
  searchBar.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    const items = Array.from(gameContainer.children);
    const tagMatches = query.match(/\[(.*?)\]/g);
    const activeTags = tagMatches 
      ? tagMatches.map(t => t.slice(1, -1).toLowerCase().trim()) 
      : [];
        const textQuery = query.replace(/\[(.*?)\]/g, '').trim().toLowerCase();
    let visibleCount = 0;
    items.forEach((item) => {
      const itemTags = item.dataset.tags || "";
      const itemName = item.dataset.name || "";
      const itemDesc = item.dataset.desc || "";      
      let isVisible = true;
      if (activeTags.length > 0) {
        const hasAllTags = activeTags.every(tag => itemTags.includes(tag));
        if (!hasAllTags) isVisible = false;
      }
      if (isVisible && textQuery.length > 0) {
        const matchesText = itemName.includes(textQuery) || itemDesc.includes(textQuery);
        if (!matchesText) isVisible = false;
      }
      if (isVisible) {
        item.style.display = "";
        visibleCount++;
        const title = item.querySelector("#gameTitle");
        const desc = item.querySelector("#gameDescription");        
        if (textQuery.length > 0) {
            if (title) highlightText(title, textQuery);
            if (desc) highlightText(desc, textQuery);
        } else {
            if (title) highlightText(title, "");
            if (desc) highlightText(desc, "");
        }
      } else {
        item.style.display = "none";
        const title = item.querySelector("#gameTitle");
        const desc = item.querySelector("#gameDescription");
        if (title) highlightText(title, "");
        if (desc) highlightText(desc, "");
      }
    });
    const gameCountElement = document.getElementById("gameCount");
    if (gameCountElement) {
      gameCountElement.textContent = visibleCount + " games available.";
    }
  });
}