function getGameCount() {
  const gameCountElement = document.getElementById("gameCount");
  const gameContainer = document.getElementById("gameContainer");
  if (gameCountElement && gameContainer) {
    gameCountElement.textContent = gameContainer.children.length + " games available.";
  }
}
function getAverageColor(thumbnail) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const img = new Image();
  img.src = thumbnail.src;
  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      let r = 0,
        g = 0,
        b = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        r += imageData.data[i];
        g += imageData.data[i + 1];
        b += imageData.data[i + 2];
      }
      const pixelCount = imageData.data.length / 4;
      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);
      resolve(`rgba(${r}, ${g}, ${b})`);
    };
    img.onerror = () => resolve("rgba(128, 128, 128, 1)"); 
  });
}
function gameLoader() {
  const gamePath = "/asset/game/";
  const descriptionsPath = "descriptions.json";
  const tagsPath = "tags.json"; 
  const gameContainer = document.getElementById("gameContainer");
  const searchBar = document.getElementById("searchBar");
  Promise.all([
    fetch(descriptionsPath).then((res) => res.json()),
    fetch(tagsPath).then((res) => res.json())
  ])
    .then(([descriptions, tagsData]) => {

      const sortedGameNames = Object.keys(descriptions).sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase())
      );
      sortedGameNames.forEach((gameName) => {
        const gameDescription = descriptions[gameName];
        const gameElement = document.createElement("div");
        gameElement.id = "gameItem"; 
        const tagsContainer = document.createElement("div");
        tagsContainer.className = "tagsContainer"; //for referencing with the search
        if (tagsData[gameName]) {
          const tagList = tagsData[gameName].split(',').map(t => t.trim());
          tagList.forEach(tagText => {
            if (!tagText) return;
            const tagElement = document.createElement("span");
            tagElement.id = "tag"; 
            tagElement.textContent = tagText;
            tagElement.addEventListener("click", (e) => {
              e.stopPropagation();
              if (searchBar) {
                const searchQuery = `[${tagText}]`;
                searchBar.value = searchQuery;
                searchBar.dispatchEvent(new Event('input'));
              }
            });
            tagsContainer.appendChild(tagElement);
          });
        }
        gameElement.title = gameDescription;

        const thumbnail = document.createElement("img");
        thumbnail.src = `${gamePath}${gameName}/cover.png`;
        thumbnail.alt = gameName;
        thumbnail.onerror = () => {
          thumbnail.src = `/asset/ui/close.svg`;
        };
        thumbnail.id = "gameThumbnail"
        getAverageColor(thumbnail).then((avgColor) => {
          thumbnail.style.boxShadow = `0 0 15px 7px ${avgColor}`;
        });
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
        gameContainer.appendChild(gameElement);
      });
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
    let visibleCount = 0;
    const tagMatch = query.match(/^\[(.*?)\]$/);
    const isTagSearch = !!tagMatch;
    const tagTerm = isTagSearch ? tagMatch[1].toLowerCase() : null;
    items.forEach((item) => {
      const title = item.querySelector("#gameTitle");
      const desc = item.querySelector("#gameDescription");
      const tagsContainer = item.querySelector(".tagsContainer");
      let isVisible = false;
      if (!query) {
        isVisible = true;
      } else if (isTagSearch) {
        if (tagsContainer) {
          const tagText = tagsContainer.textContent.toLowerCase();
          const tags = Array.from(tagsContainer.children).map(span => span.textContent.toLowerCase());
          if (tags.includes(tagTerm)) {
            isVisible = true;
          }
        }
      } else {
        const titleText = (title && (title.dataset.original || title.textContent)) || "";
        const descText = (desc && (desc.dataset.original || desc.textContent)) || "";
        const hay = (titleText + " " + descText).toLowerCase();
        const q = query.toLowerCase();

        if (hay.includes(q)) {
          isVisible = true;
        }
      }
      if (isVisible) {
        item.style.display = "";
        visibleCount++;
        if (!isTagSearch) {
            if (title) highlightText(title, query);
            if (desc) highlightText(desc, query);
        } else {
            if (title) highlightText(title, "");
            if (desc) highlightText(desc, "");
        }
      } else {
        item.style.display = "none";
        if (title) highlightText(title, "");
        if (desc) highlightText(desc, "");
      }
    });

    const gameCountElement = document.getElementById("gameCount");
    if (gameCountElement)
      gameCountElement.textContent = visibleCount + " games available.";
  });
}