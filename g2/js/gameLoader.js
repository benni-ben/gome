const _gamePath = "/asset/game/";
const _missingThumb = "/asset/ui/missing.svg";
const _missingTag = "";

function getGameCount(visibleCount) {
  const gameCountElement = document.getElementById("gameCount");
  if (gameCountElement) {
    if (typeof visibleCount === "number") {
      gameCountElement.textContent = visibleCount + " games available.";
    } else {
      const gameContainer = document.getElementById("gameContainer");
      if (!gameContainer) return;
      let n = 0;
      const children = gameContainer.children;
      for (let i = 0; i < children.length; i++) {
        if (children[i].style.display !== "none") n++;
      }
      gameCountElement.textContent = n + " games available.";
    }
  }
}

function gameLoader() {
  const gamesPath = "games.json";
  const gameContainer = document.getElementById("gameContainer");
  const searchBar = document.getElementById("searchBar");
  if (!gameContainer) return;

  fetch(gamesPath)
    .then((res) => res.json())
    .then((gamesData) => {
      const gameNames = Object.keys(gamesData);
      const lowerNames = new Array(gameNames.length);
      for (let i = 0; i < gameNames.length; i++) {
        lowerNames[i] = gameNames[i].toLowerCase();
      }
      const order = new Array(gameNames.length);
      for (let i = 0; i < order.length; i++) order[i] = i;
      order.sort((a, b) =>
        lowerNames[a] < lowerNames[b]
          ? -1
          : lowerNames[a] > lowerNames[b]
          ? 1
          : 0
      );

      const fragment = document.createDocumentFragment();
      const tagClickHandler = (e) => {
        const tagSpan = e.target.closest("#tag");
        if (!tagSpan) return;
        e.stopPropagation();
        if (!searchBar) return;
        const tagText = tagSpan.textContent;
        const currentVal = searchBar.value;
        const tagString = "[" + tagText + "]";
        if (currentVal.indexOf(tagString) !== -1) return;
        const separator = currentVal.length > 0 ? " " : "";
        searchBar.value = currentVal + separator + tagString;
        searchBar.dispatchEvent(new Event("input"));
      };

      for (let i = 0; i < order.length; i++) {
        const idx = order[i];
        const gameName = gameNames[idx];
        const gameInfo = gamesData[gameName];
        if (!gameInfo) continue;
        const gameDescription = gameInfo[0] || "";
        const gameTags = gameInfo[1] || "";

        const gameElement = document.createElement("div");
        gameElement.id = "gameItem";
        gameElement.dataset.name = lowerNames[idx];
        gameElement.dataset.tags = gameTags.toLowerCase();
        gameElement.dataset.desc = gameDescription.toLowerCase();
        gameElement.title = gameDescription;

        const thumbnail = document.createElement("img");
        thumbnail.src = _gamePath + gameName + "/cover.png";
        thumbnail.alt = gameName;
        thumbnail.loading = "lazy";
        thumbnail.decoding = "async";
        thumbnail.id = "gameThumbnail";
        thumbnail.onerror = () => {
          thumbnail.onerror = null;
          thumbnail.src = _missingThumb;
        };

        const title = document.createElement("h3");
        title.textContent = gameName;
        title.dataset.original = gameName;
        title.id = "gameTitle";

        const description = document.createElement("p");
        description.textContent = gameDescription;
        description.dataset.original = gameDescription;
        description.id = "gameDescription";

        const tagsContainer = document.createElement("div");
        tagsContainer.className = "tagsContainer";
        if (gameTags) {
          const tagList = gameTags.split(",");
          for (let t = 0; t < tagList.length; t++) {
            const tagText = tagList[t].trim();
            if (!tagText) continue;
            const tagElement = document.createElement("span");
            tagElement.id = "tag";
            tagElement.textContent = tagText;
            tagsContainer.appendChild(tagElement);
          }
        }
        gameElement.appendChild(thumbnail);
        gameElement.appendChild(title);
        gameElement.appendChild(description);
        gameElement.appendChild(tagsContainer);
        fragment.appendChild(gameElement);
      }
      gameContainer.appendChild(fragment);
      tagsContainerAddListenerOnce(gameContainer, tagClickHandler);
      gameItemClickHandlerOnce(gameContainer);
      getGameCount(gameNames.length);
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

let _tagClickListenerInstalled = false;
function tagsContainerAddListenerOnce(container, handler) {
  if (_tagClickListenerInstalled) return;
  container.addEventListener("click", handler);
  _tagClickListenerInstalled = true;
}

let _gameItemListenerInstalled = false;
function gameItemClickHandlerOnce(container) {
  if (_gameItemListenerInstalled) return;
  container.addEventListener("click", (e) => {
    const item = e.target.closest("#gameItem");
    if (!item || !container.contains(item)) return;
    const titleEl = item.querySelector("#gameTitle");
    const gameName = titleEl ? titleEl.dataset.original : null;
    if (gameName && typeof Analytics !== "undefined") {
      Analytics.trackGameVisit(gameName);
    }
    if (gameName) {
      window.location.href = _gamePath + gameName + "/";
    }
  });
  _gameItemListenerInstalled = true;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const _highlightCache = new Map();
function getHighlightRe(query) {
  let re = _highlightCache.get(query);
  if (re) return re;
  re = new RegExp(escapeRegExp(query), "gi");
  if (_highlightCache.size > 64) _highlightCache.clear();
  _highlightCache.set(query, re);
  return re;
}

function highlightText(element, query) {
  if (!element) return;
  const original = element.dataset.original;
  if (!original) return;
  if (!query) {
    if (element._highlighted) {
      element.textContent = original;
      element._highlighted = false;
    }
    return;
  }
  const re = getHighlightRe(query);
  re.lastIndex = 0;
  if (!re.test(original)) {
    if (element._highlighted) {
      element.textContent = original;
      element._highlighted = false;
    }
    return;
  }
  re.lastIndex = 0;
  const lower = original.toLowerCase();
  let result = "";
  let last = 0;
  let m;
  while ((m = re.exec(original)) !== null) {
    result +=
      original.slice(last, m.index) +
      "<mark>" +
      original.slice(m.index, m.index + m[0].length) +
      "</mark>";
    last = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex++;
  }
  result += original.slice(last);
  element.innerHTML = result;
  element._highlighted = true;
  void lower;
}

let _searchItemsCache = null;
let _searchItemsVersion = -1;
function getSearchItems(container) {
  if (_searchItemsCache && _searchItemsVersion === container.children.length) {
    return _searchItemsCache;
  }
  const items = new Array(container.children.length);
  const children = container.children;
  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    const title = el.querySelector("#gameTitle");
    const desc = el.querySelector("#gameDescription");
    items[i] = {
      el,
      name: el.dataset.name || "",
      tags: el.dataset.tags || "",
      desc: el.dataset.desc || "",
      title,
      descEl: desc,
    };
  }
  _searchItemsCache = items;
  _searchItemsVersion = container.children.length;
  return items;
}

function setupSearch() {
  const searchBar = document.getElementById("searchBar");
  const gameContainer = document.getElementById("gameContainer");
  if (!searchBar || !gameContainer) return;

  let scheduled = false;
  const runSearch = (rawValue) => {
    scheduled = false;
    const query = rawValue.trim();
    const tagMatches = query.match(/\[(.*?)\]/g);
    const activeTags = tagMatches
      ? tagMatches.map((t) => t.slice(1, -1).toLowerCase().trim())
      : [];
    const textQuery = query.replace(/\[(.*?)\]/g, "").trim().toLowerCase();

    const items = getSearchItems(gameContainer);
    let visibleCount = 0;
    const hasText = textQuery.length > 0;
    const hasTags = activeTags.length > 0;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      let isVisible = true;

      if (hasTags) {
        const itemTags = it.tags;
        for (let t = 0; t < activeTags.length; t++) {
          if (itemTags.indexOf(activeTags[t]) === -1) {
            isVisible = false;
            break;
          }
        }
      }

      if (isVisible && hasText) {
        if (it.name.indexOf(textQuery) === -1 && it.desc.indexOf(textQuery) === -1) {
          isVisible = false;
        }
      }

      if (isVisible) {
        if (it.el.style.display === "none") it.el.style.display = "";
        visibleCount++;
        if (hasText) {
          highlightText(it.title, textQuery);
          highlightText(it.descEl, textQuery);
        } else if (it.title._highlighted || it.descEl._highlighted) {
          highlightText(it.title, "");
          highlightText(it.descEl, "");
        }
      } else {
        if (it.el.style.display !== "none") it.el.style.display = "none";
        if (it.title._highlighted || it.descEl._highlighted) {
          highlightText(it.title, "");
          highlightText(it.descEl, "");
        }
      }
    }

    const gameCountElement = document.getElementById("gameCount");
    if (gameCountElement) {
      gameCountElement.textContent = visibleCount + " games available.";
    }
  };

  searchBar.addEventListener("input", (e) => {
    if (scheduled) return;
    const value = e.target.value;
    scheduled = true;
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => runSearch(value));
    } else {
      setTimeout(() => runSearch(value), 0);
    }
  });
}
