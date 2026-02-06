let settings = {
    animations: true,
    notifications: true,
    pageTitle: (typeof document !== 'undefined' && document.title) ? document.title : "Gome",
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
    if (typeof title !== 'string') return;
    settings.pageTitle = title;
    document.title = title;
    window.pageTitle = title;
    saveSettings();
};

function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
}

function loadSettings() {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            settings = Object.assign({}, settings, parsed || {});
            window.animations = settings.animations;
            window.notifications = settings.notifications;
            if (settings.pageTitle) document.title = settings.pageTitle;
            if (settings.animations === false) {
                pageAnimations(false);
            }
        } catch (e) {
            console.error("Error loading settings:", e);
        }
    }
}
