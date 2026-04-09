let settings = {
    analytics: true,
    animations: true,
    notifications: true,
    pageTitle: (typeof document !== "undefined" && document.title) ? document.title : "Gome",
};

function pageAnimations(bool) {
    const id = "animationDisable";
    const enabled = Boolean(bool);
    settings.animations = enabled;
    if (enabled === false) {
        if (!document.getElementById(id)) {
            const style = document.createElement("style");
            style.id = id;
            style.textContent = "* { -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important; -webkit-animation: none !important; animation: none !important; }";
            (document.head || document.documentElement).appendChild(style);
        }
    } else {
        const element = document.getElementById(id);
        if (element) element.remove();
    }
    window.animations = settings.animations;
    saveSettings();
};

function notifications(bool) {
    const enabled = Boolean(bool);
    settings.notifications = enabled;
    window.notifications = enabled;
    saveSettings();
};

function changeWebpageTitle(title) {
    if (typeof title !== "string") return;
    settings.pageTitle = title;
    document.title = title;
    window.pageTitle = title;
    saveSettings();
};

function saveSettings() {
    if (typeof localStorageSave === "function") {
        try {
            localStorageSave("settings", settings);
        } catch (e) {
            console.error("Oh no... there was an error saving settings via localStorageSave function:", e);
        }
    } else {
        try {
            localStorage.setItem("settings", JSON.stringify(settings));
        } catch (e) {
            console.error("Oh no... there was an error saving settings to localStorage:", e);
        }
    }
}

function loadSettings() {
    let parsed = null;
    if (typeof localStorageLoad === "function") {
        parsed = localStorageLoad("settings", true);
    } else {
        const raw = localStorage.getItem("settings");
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            console.error("Oh no... there was an error loading the settings:", e);
            parsed = null;
        }
    }

    if (parsed) {
        settings = Object.assign({}, settings, parsed || {});
        window.animations = settings.animations;
        window.notifications = settings.notifications;
        if (settings.pageTitle) document.title = settings.pageTitle;
        try {
            const container = (typeof document !== "undefined") && document.getElementById && document.getElementById("settingsContent");
            if (container) {
                const rows = container.querySelectorAll(".setting-row");
                rows.forEach(row => {
                    const label = row.querySelector("label");
                    const input = row.querySelector(".control");
                    if (!label || !input) return;
                    const name = (label.textContent || "").trim();
                    if (name === "Webpage Title") {
                        input.value = settings.pageTitle || "";
                    }
                });
            }
        } catch (e) {
            console.error("Oh no... there was an error updating settings controls:", e);
        }
        if (settings.animations === false) {
            pageAnimations(false);
        }
    }
}
