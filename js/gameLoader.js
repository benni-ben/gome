const GameLoader = (function () {
  "use strict";

  const CONFIG = Object.freeze({
    gamesJsonPath: "games.json",
    gameBasePath: "/asset/game/",
    missingThumbnail: "/asset/ui/missing.svg",
    containerId: "gameContainer",
    searchBarId: "searchBar",
    gameCountId: "gameCount",
  });

  const CLASSES = Object.freeze({
    gameItem: "game-item",
    gameThumbnail: "game-thumbnail",
    gameTitle: "game-title",
    gameDescription: "game-description",
    tag: "game-tag",
    tagsContainer: "tags-container",
  });

  const REGEX_SPECIALS = /[.*+?^${}()|[\]\\]/g;
  const TAG_PATTERN = /\[(.*?)\]/g;

  const highlightedElements = new WeakSet();
  const highlightCache = new Map();
  let tagListenerInstalled = false;
  let itemListenerInstalled = false;
  let searchItemsCache = null;
  let searchItemsVersion = -1;

  function escapeRegExp(string) {
    return string.replace(REGEX_SPECIALS, "\\$&");
  }

  function getHighlightRegex(query) {
    let regex = highlightCache.get(query);
    if (!regex) {
      regex = new RegExp(escapeRegExp(query), "gi");
      if (highlightCache.size >= 64) highlightCache.clear();
      highlightCache.set(query, regex);
    }
    return regex;
  }

  function parseQuery(query) {
    const tagMatches = query.match(TAG_PATTERN);
    const activeTags = tagMatches
      ? tagMatches.map((tag) => tag.slice(1, -1).toLowerCase().trim())
      : [];
    const textQuery = query.replace(/\[(.*?)\]/g, "").trim().toLowerCase();
    return { activeTags, textQuery };
  }

  function parseGameEntry(name, entry) {
    if (!Array.isArray(entry)) return null;
    const [description = "", tags = ""] = entry;
    return { name, description, tags };
  }

  function parseGames(gamesData) {
    const games = [];
    for (const name of Object.keys(gamesData)) {
      const parsed = parseGameEntry(name, gamesData[name]);
      if (parsed) games.push(parsed);
    }
    games.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
        numeric: true,
      })
    );
    return games;
  }

  function createThumbnail(gameName) {
    const thumbnail = document.createElement("img");
    thumbnail.className = CLASSES.gameThumbnail;
    thumbnail.src = CONFIG.gameBasePath + gameName + "/cover.png";
    thumbnail.alt = gameName + " cover";
    thumbnail.loading = "lazy";
    thumbnail.decoding = "async";
    thumbnail.onerror = () => {
      thumbnail.onerror = null;
      thumbnail.src = CONFIG.missingThumbnail;
    };
    return thumbnail;
  }

  function createTagElement(tagText) {
    const tag = document.createElement("span");
    tag.className = CLASSES.tag;
    tag.textContent = tagText;
    tag.title = 'Search for "' + tagText + '"';
    return tag;
  }

  function createTagsContainer(tags) {
    const tagsContainer = document.createElement("div");
    tagsContainer.className = CLASSES.tagsContainer;
    if (tags) {
      const tagList = tags.split(",");
      for (const rawTag of tagList) {
        const tagText = rawTag.trim();
        if (!tagText) continue;
        tagsContainer.appendChild(createTagElement(tagText));
      }
    }
    return tagsContainer;
  }

  function createGameElement(game) {
    const gameElement = document.createElement("div");
    gameElement.className = CLASSES.gameItem;
    gameElement.dataset.name = game.name.toLowerCase();
    gameElement.dataset.tags = game.tags.toLowerCase();
    gameElement.dataset.desc = game.description.toLowerCase();
    gameElement.title = game.description;

    const thumbnail = createThumbnail(game.name);

    const titleElement = document.createElement("h3");
    titleElement.className = CLASSES.gameTitle;
    titleElement.textContent = game.name;
    titleElement.dataset.original = game.name;

    const descriptionElement = document.createElement("p");
    descriptionElement.className = CLASSES.gameDescription;
    descriptionElement.textContent = game.description;
    descriptionElement.dataset.original = game.description;

    const tagsContainer = createTagsContainer(game.tags);

    gameElement.append(thumbnail, titleElement, descriptionElement, tagsContainer);
    return gameElement;
  }

  function renderGames(games) {
    const container = document.getElementById(CONFIG.containerId);
    if (!container) return;

    const fragment = document.createDocumentFragment();
    for (const game of games) {
      fragment.appendChild(createGameElement(game));
    }
    container.appendChild(fragment);

    installTagClickListener();
    installGameClickListener();
    setGameCount(games.length);
    setupSearch();
  }

  function onTagClick(event) {
    const tag = event.target.closest("." + CLASSES.tag);
    if (!tag) return;
    event.stopPropagation();
    const searchBar = document.getElementById(CONFIG.searchBarId);
    if (!searchBar) return;
    const tagQuery = "[" + tag.textContent + "]";
    searchBar.value = tagQuery;
    searchBar.dispatchEvent(new Event("input"));
  }

  function installTagClickListener() {
    if (tagListenerInstalled) return;
    const container = document.getElementById(CONFIG.containerId);
    if (!container) return;
    container.addEventListener("click", onTagClick);
    tagListenerInstalled = true;
  }

  function onGameItemClick(event) {
    if (event.target.closest("." + CLASSES.tag)) return;
    const item = event.target.closest("." + CLASSES.gameItem);
    if (!item) return;
    const titleElement = item.querySelector("." + CLASSES.gameTitle);
    const gameName = titleElement ? titleElement.dataset.original : null;
    if (!gameName) return;
    if (typeof Analytics !== "undefined") {
      Analytics.trackGameVisit(gameName);
    }
    window.location.href = CONFIG.gameBasePath + gameName + "/";
  }

  function installGameClickListener() {
    if (itemListenerInstalled) return;
    const container = document.getElementById(CONFIG.containerId);
    if (!container) return;
    container.addEventListener("click", onGameItemClick);
    itemListenerInstalled = true;
  }

  function isHighlighted(element) {
    return element && highlightedElements.has(element);
  }

  function resetHighlight(element) {
    if (!element || !element.dataset.original) return;
    element.textContent = element.dataset.original;
    highlightedElements.delete(element);
  }

  function highlightText(element, query) {
    if (!element || !element.dataset.original) return;
    const original = element.dataset.original;

    if (!query) {
      if (isHighlighted(element)) resetHighlight(element);
      return;
    }

    const regex = getHighlightRegex(query);
    regex.lastIndex = 0;
    let result = "";
    let last = 0;
    let match;
    let matched = false;
    while ((match = regex.exec(original)) !== null) {
      matched = true;
      result +=
        original.slice(last, match.index) +
        "<mark>" +
        original.slice(match.index, match.index + match[0].length) +
        "</mark>";
      last = match.index + match[0].length;
      if (match[0].length === 0) regex.lastIndex++;
    }

    if (matched) {
      result += original.slice(last);
      element.innerHTML = result;
      highlightedElements.add(element);
    } else if (isHighlighted(element)) {
      resetHighlight(element);
    }
  }

  function getSearchItems(container) {
    if (
      searchItemsCache &&
      searchItemsVersion === container.children.length
    ) {
      return searchItemsCache;
    }
    const children = container.children;
    const items = new Array(children.length);
    for (let i = 0; i < children.length; i++) {
      const gameElement = children[i];
      items[i] = {
        element: gameElement,
        name: gameElement.dataset.name || "",
        tags: gameElement.dataset.tags || "",
        desc: gameElement.dataset.desc || "",
        titleElement: gameElement.querySelector("." + CLASSES.gameTitle),
        descElement: gameElement.querySelector("." + CLASSES.gameDescription),
      };
    }
    searchItemsCache = items;
    searchItemsVersion = children.length;
    return items;
  }

  function runSearch(rawValue) {
    const query = rawValue.trim();
    const { activeTags, textQuery } = parseQuery(query);

    const container = document.getElementById(CONFIG.containerId);
    if (!container) return;
    const items = getSearchItems(container);

    const hasText = textQuery.length > 0;
    const hasTags = activeTags.length > 0;
    let visibleCount = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let isVisible = true;

      if (hasTags) {
        for (let t = 0; t < activeTags.length; t++) {
          if (item.tags.indexOf(activeTags[t]) === -1) {
            isVisible = false;
            break;
          }
        }
      }

      if (isVisible && hasText) {
        if (
          item.name.indexOf(textQuery) === -1 &&
          item.desc.indexOf(textQuery) === -1
        ) {
          isVisible = false;
        }
      }

      if (isVisible) {
        if (item.element.style.display === "none") item.element.style.display = "";
        visibleCount++;
        if (hasText) {
          highlightText(item.titleElement, textQuery);
          highlightText(item.descElement, textQuery);
        } else if (
          isHighlighted(item.titleElement) ||
          isHighlighted(item.descElement)
        ) {
          resetHighlight(item.titleElement);
          resetHighlight(item.descElement);
        }
      } else {
        if (item.element.style.display !== "none") item.element.style.display = "none";
        if (
          isHighlighted(item.titleElement) ||
          isHighlighted(item.descElement)
        ) {
          resetHighlight(item.titleElement);
          resetHighlight(item.descElement);
        }
      }
    }

    setGameCount(visibleCount);
  }

  function setupSearch() {
    const searchBar = document.getElementById(CONFIG.searchBarId);
    if (!searchBar) return;

    let scheduled = false;
    const flush = (value) => {
      scheduled = false;
      runSearch(value);
    };

    searchBar.addEventListener("input", (event) => {
      if (scheduled) return;
      scheduled = true;
      const value = event.target.value;
      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(() => flush(value));
      } else {
        setTimeout(() => flush(value), 0);
      }
    });
  }

  function setGameCount(count) {
    const countElement = document.getElementById(CONFIG.gameCountId);
    if (countElement) countElement.textContent = count + " games available.";
  }

  function getGameCount(visibleCount) {
    if (typeof visibleCount === "number") {
      setGameCount(visibleCount);
      return;
    }
    const container = document.getElementById(CONFIG.containerId);
    if (!container) return;
    let visible = 0;
    for (let i = 0; i < container.children.length; i++) {
      if (container.children[i].style.display !== "none") visible++;
    }
    setGameCount(visible);
  }

  function init() {
    const container = document.getElementById(CONFIG.containerId);
    if (!container) return;

    fetch(CONFIG.gamesJsonPath)
      .then((response) => response.json())
      .then((gamesData) => {
        const games = parseGames(gamesData);
        renderGames(games);
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

  return {
    init: init,
    getGameCount: getGameCount,
  };
})();

window.gameLoader = GameLoader.init;
window.getGameCount = GameLoader.getGameCount;
