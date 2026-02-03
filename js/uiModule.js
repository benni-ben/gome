function initializeSettingsMenu() {
    const settingsBtn = document.getElementById('icon');
    const settingsMenu = document.getElementById('settingsMenuMain');
    const closeBtn = document.getElementById('close');
    const overlay = document.getElementById('settingsOverlay');

    function openSettings() {
        settingsMenu.classList.add('open');
        overlay.classList.add('open');
        if (settingsBtn) settingsBtn.classList.add('open');
        if (closeBtn) closeBtn.focus();
    }

    function closeSettings() {
        settingsMenu.classList.remove('open');
        overlay.classList.remove('open');
        if (settingsBtn) settingsBtn.classList.remove('open');

        if (settingsBtn) settingsBtn.focus();
    }

    function toggleSettings() {
        if (settingsMenu.classList.contains('open')) closeSettings(); else openSettings();
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', toggleSettings);
        settingsBtn.addEventListener('keydown', (ev) => {
            if (ev.code === 'Enter' || ev.code === 'Space') {
                ev.preventDefault();
                toggleSettings();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSettings);
        closeBtn.addEventListener('keydown', (ev) => {
            if (ev.code === 'Enter' || ev.code === 'Space') {
                ev.preventDefault();
                closeSettings();
            }
        });
    }

    return { openSettings, closeSettings, toggleSettings };
}

function initializeFeedbackMenu(overlay) {
    const feedbackBtn = document.querySelector('.feedback');
    const feedbackMenu = document.getElementById('feedbackMenuMain');
    const feedbackCloseBtn = document.getElementById('feedbackClose');
    const submitFeedbackBtn = document.getElementById('submitFeedback');
    const feedbackText = document.getElementById('feedbackText');

    function openFeedback() {
        const settingsMenu = document.getElementById('settingsMenuMain');
        if (settingsMenu && settingsMenu.classList.contains('open')) {
            settingsMenu.classList.remove('open');
            document.getElementById('icon').classList.remove('open');
        }
        feedbackMenu.classList.add('open');
        overlay.classList.add('open');
        if (feedbackBtn) feedbackBtn.classList.add('open');
        if (feedbackText) feedbackText.focus();
    }

    function closeFeedback() {
        feedbackMenu.classList.remove('open');
        overlay.classList.remove('open');
        if (feedbackBtn) feedbackBtn.classList.remove('open');
        if (feedbackBtn) feedbackBtn.focus();
    }

    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', openFeedback);
        feedbackBtn.style.cursor = 'pointer';
    }

    if (feedbackCloseBtn) {
        feedbackCloseBtn.addEventListener('click', closeFeedback);
        feedbackCloseBtn.addEventListener('keydown', (ev) => {
            if (ev.code === 'Enter' || ev.code === 'Space') {
                ev.preventDefault();
                closeFeedback();
            }
        });
    }

    async function sendFeedback(message) {
        const response = await fetch("https://gomestable.netlify.app/.netlify/functions/discord-webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ feedback: message })
        });

        return response.ok;
    }

    if (submitFeedbackBtn) {
        submitFeedbackBtn.addEventListener('click', async () => {
            const message = feedbackText.value.trim();
            if (message) {
                notify("Thank you for your feedback!", "Feedback Sent", "specialday.svg", "8000");
                feedbackText.value = "";
                closeFeedback();
                const success = await sendFeedback(message);
                if (!success) {
                    console.error("Failed to send feedback");
                }
            } else {
                notify("Please enter some feedback.", "Empty Feedback", "error.svg", "7000");
            }
        });
    }

    return { openFeedback, closeFeedback };
}

function initializeOverlayBehavior() {
    const overlay = document.getElementById('settingsOverlay');
    const settingsMenu = document.getElementById('settingsMenuMain');
    const feedbackMenu = document.getElementById('feedbackMenuMain');

    if (overlay) {
        overlay.addEventListener('click', () => {
            if (settingsMenu && settingsMenu.classList.contains('open')) {
                settingsMenu.classList.remove('open');
                document.getElementById('icon').classList.remove('open');
            }
            if (feedbackMenu && feedbackMenu.classList.contains('open')) {
                feedbackMenu.classList.remove('open');
                document.querySelector('.feedback').classList.remove('open');
            }
            overlay.classList.remove('open');
        });
    }
}

function initializeKeyboardShortcuts() {
    const settingsMenu = document.getElementById('settingsMenuMain');
    const feedbackMenu = document.getElementById('feedbackMenuMain');
    const overlay = document.getElementById('settingsOverlay');

    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' || ev.code === 'Escape') {
            if (settingsMenu && settingsMenu.classList.contains('open')) {
                settingsMenu.classList.remove('open');
                document.getElementById('icon').classList.remove('open');
                overlay.classList.remove('open');
            }
            if (feedbackMenu && feedbackMenu.classList.contains('open')) {
                feedbackMenu.classList.remove('open');
                document.querySelector('.feedback').classList.remove('open');
                overlay.classList.remove('open');
            }
        }
    });
}

function initializeInfoIcon() {
    const infoIcon = document.getElementsByClassName("infoicon")[0];
    if (infoIcon) {
        infoIcon.addEventListener("click", function () {
            notify("Gome is a web-based game launcher created by benni-ben. Custom modded gomes are coming, so please stay tuned. If you want to suggest a gome for me to mod, add it in feedback, although there is no guerentee that I will be able to add a certain game.", "About Gome", "info.svg");
        });
    }
}

function initializeSearch() {
    const searchBar = document.getElementById('searchBar');
    const gameContainer = document.getElementById('gameContainer');
    const gameCountElement = document.getElementById('gameCount');

    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if (searchBar) {
        //filter on change
        searchBar.addEventListener('input', () => {
            const q = searchBar.value.trim().toLowerCase();
            const items = Array.from(gameContainer.children);
            let visible = 0;

            items.forEach(item => {
                const titleElem = item.querySelector('#gameTitle') || item.querySelector('h3');
                const title = titleElem ? titleElem.textContent.trim().toLowerCase() : '';

                if (!q || title.includes(q)) {
                    item.style.display = '';
                    visible++;
                    if (titleElem && q) {
                        const raw = titleElem.textContent.replace(/<mark>|<\/mark>/g, '');
                        const rx = new RegExp(`(${escapeRegExp(q)})`, 'ig');
                        titleElem.innerHTML = raw.replace(rx, '<mark>$1</mark>');
                    } else if (titleElem) {
                        titleElem.innerHTML = titleElem.textContent.replace(/<mark>|<\/mark>/g, '');
                    }
                } else {
                    // hide anything that doesnt contain the search text
                    item.style.display = 'none';
                }
            });
            gameCountElement.textContent = visible + ' games available.';
        });

        searchBar.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape') {
                searchBar.value = '';
                searchBar.dispatchEvent(new Event('input'));
            }
        });
    }
}

function initializeGitHubLink() {
    const github = document.getElementsByClassName('github')[0];
    // GitHub link can be interactive if needed, currently just for reference
}
