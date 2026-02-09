function openSettingsMenu() {
    const overlay = document.getElementById("settingsOverlay");
    const settingsMenu = document.getElementById("settingsMenuMain");

    if (overlay && settingsMenu) {
        overlay.classList.add("open");
        settingsMenu.classList.add("open");
    }
}

function closeSettingsMenu() {
    const overlay = document.getElementById("settingsOverlay");
    const settingsMenu = document.getElementById("settingsMenuMain");

    if (overlay && settingsMenu) {
        overlay.classList.remove("open");
        settingsMenu.classList.remove("open");
    }
}

function openFeedbackMenu() {
    const overlay = document.getElementById("settingsOverlay");
    const feedbackMenu = document.getElementById("feedbackMenuMain");

    if (overlay && feedbackMenu) {
        overlay.classList.add("open");
        feedbackMenu.classList.add("open");
    }
}

function closeFeedbackMenu() {
    const overlay = document.getElementById("settingsOverlay");
    const feedbackMenu = document.getElementById("feedbackMenuMain");

    if (overlay && feedbackMenu) {
        overlay.classList.remove("open");
        feedbackMenu.classList.remove("open");
    }
}

async function createSettings() {
    const settingsIndexPath = "/js/settingsIndex.json";
    const container = document.getElementById("settingsContent");
    if (!container) return;
    container.innerHTML = "";
    try {
        const res = await fetch(settingsIndexPath, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load settings index");
        const index = await res.json();
        const entries = Object.entries(index).sort((a, b) => a[0].localeCompare(b[0], undefined, { sensitivity: "base" }));
        for (const [name, meta] of entries) {
            const row = document.createElement("div");
            row.className = "setting-row";
            const left = document.createElement("div");
            left.className = "setting-left";
            const label = document.createElement("label");
            label.textContent = name;
            label.style.fontWeight = "600";
            let control;
            if (meta.inputType === "switch") {
                control = document.createElement("input");
                control.type = "checkbox";
                control.checked = Boolean(meta.default);
            } else if (meta.inputType === "text") {
                control = document.createElement("input");
                control.type = "text";
                control.value = (meta.default !== undefined && meta.default !== null) ? meta.default : "";
                control.style.minWidth = "160px";
            } else {
                control = document.createElement("input");
                control.type = "text";
                control.value = meta.default || "";
            }
            control.className = "control"
            if (meta.associatedFunction && typeof meta.associatedFunction === "string") {
                const fnName = meta.associatedFunction.replace(/\(\)\s*$/, "").trim();
                control.addEventListener("change", (e) => {
                    const val = (control.type === "checkbox") ? control.checked : control.value;
                    const fn = window[fnName];
                    if (typeof fn === "function") {
                        try {
                            fn(val);
                            if (typeof loadSettings === "function") {
                                loadSettings();
                            }
                        } catch (err) {
                            console.error("Error calling associated function", fnName, err);
                        }
                    }
                });
            }
            left.appendChild(label);
            left.appendChild(control);
            const desc = document.createElement("div");
            desc.className = "setting-description";
            desc.innerHTML = meta.description || "";
            row.appendChild(left);
            row.appendChild(desc);
            container.appendChild(row);
        }
    } catch (e) {
        console.error("createSettings error:", e);
    }
    if (typeof loadSettings === "function") loadSettings();
}