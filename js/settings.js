const storageDBname = "settings_gome"
const settings = {
    animations_animationStatus: "Enabled",
    animations_timeScale: 1,
    debug_logUserActionsToConsole: "false",
    notifications_notificationsEnabled: "true",
    notifications_notificationLoudAlarm: "false",
    themeing_backgroundColorOverride: "none",
};
const defaultSettings = JSON.parse(JSON.stringify(settings));
const settingDescriptions = {
    animations_animationStatus: { description: "Whether the animations are disabled or enabled. May improve performance on potato devices.", type: "toggle" },
    animations_timeScale: { description: "Animation speed for all animations on the page.", type: "slider", min: 0.1, max: 10 },
    danger_resetSettings: { description: "Deletes and resets your current settings back to the defaults.", type: "button" },
    notifications_notificationsEnabled: { description: "Enables or diables global notifications.", type: "toggle" },
    notifications_notificationLoudAlarm: { description: "Plays an 'extremely relaxing' alarm sound whenever you get a notification. As of right now, the volume will always be at maximum.", type: "toggle" },
    themeing_backgroundColorOverride: { description: "The page's background color.", type: "color" },
};

function saveSettingsToLocalStorage() {
    try {
        localStorage.setItem(storageDBname, JSON.stringify(settings));
    } catch (e) {
        console.warn('Could not save settings to localStorage', e);
        notify("Could not save settings to local storage. When you reload, settings may be reverted back to their original values.", "error.svg", "6000")
    }
}

function loadSavedSettings() {
    try {
        const saved = localStorage.getItem(storageDBname);
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.keys(parsed).forEach(k => {
                if (settings.hasOwnProperty(k)) settings[k] = parsed[k];
            });
        }
    } catch (e) {
        console.warn('Could not load saved settings', e);
    }
    //apply loaded settings
    Object.keys(settings).forEach(k => applySettingEffect(k, settings[k]));
}

function applySettingEffect(key, value) {
    switch (key) {
        case 'themeing_backgroundColorOverride':
            if (value && value !== 'none') {
                document.body.style.backgroundColor = value;
            } else {
                document.body.style.backgroundColor = '';
            }
            break;
        case 'animations_timeScale':
            const scale = Number(value) || 1;
            try {
                document.getAnimations().forEach(anim => {
                    try { anim.playbackRate = scale; } catch (e) { }
                });
            } catch (e) { }
            break;
        case 'animations_animationStatus':
            const mode2 = String(value);
            if (mode2 === 'Disabled') {
                document.getAnimations().forEach(anim => {
                    anim.style.transition = "none";
                });
            }
            break;
        default:
            break;
    }
}

function setSettingValue(key, value) {
    settings[key] = value;
    saveSettingsToLocalStorage();
    applySettingEffect(key, value);
}

function buildSettingsUI() {
    const container = document.getElementById('actualSettings');
    const info = document.getElementById('settingsMenuInfo');
    container.innerHTML = '';

    const prettyName = (key) => key.split('_').map(p => p.replace(/([A-Z])/g, ' $1')).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' - ');

    Object.keys(settingDescriptions).forEach(key => {
        const desc = settingDescriptions[key];
        const row = document.createElement('div');
        row.className = 'settingRow';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '10px 18px';

        const left = document.createElement('div');
        left.className = 'settingLabel';
        left.id = 'settingValueTitle';
        left.textContent = prettyName(key);
        left.title = desc.description || '';

        const right = document.createElement('div');
        right.className = 'settingControl';

        //hover updates info area
        row.addEventListener('mouseenter', () => { if (info) info.textContent = desc.description || ''; });
        row.addEventListener('mouseleave', () => { if (info) info.textContent = 'Hover over a setting for more information.'; });
        if (desc.type === 'toggle') {
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = (String(settings[key]) === 'true' || settings[key] === true);
            input.addEventListener('change', () => setSettingValue(key, input.checked ? 'true' : 'false'));
            right.appendChild(input);
        } else if (desc.type === 'slider') {
            const input = document.createElement('input');
            input.type = 'range';
            input.min = desc.min ?? 0.1;
            input.max = desc.max ?? 10;
            input.step = desc.step ?? 0.1;
            input.value = Number(settings[key]) || Number(input.min);
            input.style.width = '180px';
            const label = document.createElement('span');
            label.textContent = input.value;
            label.style.marginLeft = '8px';
            label.style.fontFamily = 'Fira Mono';
            input.addEventListener('input', () => { label.textContent = input.value; });
            input.addEventListener('change', () => setSettingValue(key, input.value));
            right.appendChild(input);
            right.appendChild(label);
        } else if (desc.type === 'verticalMenu' || desc.type === 'select') {
            const sel = document.createElement('select');
            sel.setAttribute('aria-label', left.textContent + ' options');
            (desc.options || []).forEach(opt => {
                const o = document.createElement('option'); o.value = opt; o.textContent = opt; sel.appendChild(o);
            });
            sel.value = settings[key] ?? (desc.options && desc.options[0]) ?? '';
            sel.addEventListener('change', () => setSettingValue(key, sel.value));
            right.appendChild(sel);
        } else if (desc.type === 'color') {
            const color = document.createElement('input');
            color.type = 'color';
            color.value = (settings[key] && settings[key] !== 'none') ? settings[key] : '#000000';
            color.addEventListener('change', () => setSettingValue(key, color.value));
            right.appendChild(color);
        } else if (desc.type === 'button') {
            const btn = document.createElement('button');
            btn.textContent = "Delete";
            btn.id = 'button'
            btn.addEventListener('click', () => {
                if (!confirm('This will reset ALL of your settings in to their defaults. Are you sure you want to continue?')) return;
                try { localStorage.removeItem(storageDBname); } catch (e) { }
                //reset in-memory copy
                Object.keys(defaultSettings).forEach(k => settings[k] = defaultSettings[k]);
                saveSettingsToLocalStorage();
                //reapply and rebuild UI
                Object.keys(settings).forEach(k => applySettingEffect(k, settings[k]));
                buildSettingsUI();
                notify("");
            });
            right.appendChild(btn);
        } else {
            const span = document.createElement('span'); span.textContent = settings[key]; right.appendChild(span);
        }

        row.appendChild(left);
        row.appendChild(right);
        container.appendChild(row);
    });
}
