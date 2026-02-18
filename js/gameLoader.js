function getGameCount() {
    const gameCountElement = document.getElementById("gameCount");
    const gameContainer = document.getElementById("gameContainer");
    gameCountElement.textContent = gameContainer.children.length + " games available.";
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
            let r = 0, g = 0, b = 0;
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
    });
}

function gameLoader() {
    const gamePath = "/asset/game/";
    const descriptionsPath = "descriptions.json";
    const gameContainer = document.getElementById("gameContainer");
    fetch(descriptionsPath)
        .then(response => response.json())
        .then(descriptions => {
            //we get all the games in the directory(from the descriptions.json file)
            Object.keys(descriptions).forEach(gameName => {
                const gameDescription = descriptions[gameName];
                const gameElement = document.createElement("div");
                gameElement.title = descriptions[gameName];
                const thumbnail = document.createElement("img");
                thumbnail.src = `${gamePath}${gameName}/cover.png`;
                thumbnail.alt = gameName;
                getAverageColor(thumbnail).then(avgColor => {
                    thumbnail.style.boxShadow = `0 0 15px 7px ${avgColor}`;
                });
                //the title gets made above the description
                const title = document.createElement("h3");
                title.textContent = gameName;
                title.dataset.original = gameName;
                //the description gets made below the title
                const description = document.createElement("p");
                description.textContent = gameDescription;
                description.dataset.original = gameDescription;
                gameElement.addEventListener("click", () => {
                    // Track game visit in analytics
                    if (typeof Analytics !== 'undefined') {
                        Analytics.trackGameVisit(gameName);
                    }
                    window.location.href = `${gamePath}${gameName}/`;
                });
                description.id = "gameDescription";
                title.id = "gameTitle";
                thumbnail.id = "gameThumbnail";
                gameElement.id = "gameItem";
                //we finally append the elements to the game container
                gameElement.appendChild(thumbnail);
                gameElement.appendChild(title);
                gameElement.appendChild(description);
                gameContainer.appendChild(gameElement);
            });
            //update game count
            getGameCount();
            // set up search behavior after games are loaded
            setupSearch();
        })
        .catch(error => console.error("Oops! There was an error loading games:", error),
        window.notify("An error occured loading the games! Check the developer console for more info.", "Oh noes!", "sad.svg", "6000")
    );
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(element, query) {
    const original = element.dataset.original || element.textContent;
    if (!query) {
        element.textContent = original;
        return;
    }
    const re = new RegExp(escapeRegExp(query), 'gi');
    element.innerHTML = original.replace(re, match => `<mark>${match}</mark>`);
}

function setupSearch() {
    const searchBar = document.getElementById('searchBar');
    const gameContainer = document.getElementById('gameContainer');
    if (!searchBar || !gameContainer) return;

    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        const items = Array.from(gameContainer.children);
        let visibleCount = 0;
        items.forEach(item => {
            const title = item.querySelector('#gameTitle');
            const desc = item.querySelector('#gameDescription');
            const titleText = (title && (title.dataset.original || title.textContent)) || '';
            const descText = (desc && (desc.dataset.original || desc.textContent)) || '';
            const hay = (titleText + ' ' + descText).toLowerCase();
            const q = query.toLowerCase();
            if (!q || hay.includes(q)) {
                item.style.display = '';
                visibleCount++;
                if (title) highlightText(title, query);
                if (desc) highlightText(desc, query);
            } else {
                item.style.display = 'none';
                if (title) highlightText(title, '');
                if (desc) highlightText(desc, '');
            }
        });
        const gameCountElement = document.getElementById('gameCount');
        if (gameCountElement) gameCountElement.textContent = visibleCount + ' games available.';
    });
}
