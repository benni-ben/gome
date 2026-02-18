function getAndSetTimeAndDate() {
    const now = new Date();
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    timeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    dateElement.textContent = now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
}

function setGradientColors(color1, color2, color3) {
    document.documentElement.style.setProperty('--head-grad-color-1', color1);
    document.documentElement.style.setProperty('--head-grad-color-2', color2);
    document.documentElement.style.setProperty('--head-grad-color-3', color3);
}

function getTimeAssociatedColors() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const occasionColors = {
        "12-25": ["#1d9946", "#c21742", "#1d9946"],
        "10-31": ["#9634c7", "#004E89", "#9634c7"],
        "2-14": ["#8c2f39", "#461220", "#8c2f39"],
        "7-4": ["#f94144", "#3a0ca3", "#f94144"],
        "1-1": ["#FFD700", "#C0C0C0", "#000000"],
        "11-11": ["#663399", "#4d908e", "#FFFFFF"],
        "3-17": ["#009B77", "#8cb369", "#577590"],
        "1-19": ["#481d24", "#FFFFFF", "#8f2d56"],
        "2-16": ["#0fa3b1", "#FFFFFF", "#c5283d"],
        "5-25": ["#000000", "#06d6a0", "#ffd166"],
        "5-12": ["#c65b7c", "#ff5714", "#ef6f6c"],
        "6-16": ["#5b5f97", "#607b7d", "#5b5f97"],
        "5-5": ["#607b7d", "#FFFFFF", "#f45b69"],
        "6-19": ["#d56062", "#ebebeb", "#52489c"],
        "9-7": ["#59c3c3", "#ff5714", "#FFFFFF"],
        "10-12": ["#009fb7", "#2274a5", "#59c3c3"],
        "11-27": ["#faa613", "#550527", "#fed766"],
        "11-28": ["#1e1b18", "#7fb800", "#59cd90"],
        "11-4": ["#c5283d", "#f7edf0", "#26547c"],
    };
    const dateKey = `${month}-${day}`;
    const occasionNames = {
        "12-25": "Christmas",
        "10-31": "Halloween",
        "2-14": "Valentine's Day",
        "7-4": "Independence Day",
        "1-1": "New Years Day",
        "11-11": "Veterans Day",
        "3-17": "St. Patrick's Day",
        "1-19": "Martin Luther King Jr. Day",
        "2-16": "Presidents' Day",
        "5-25": "Memorial Day",
        "5-12": "Mother's Day",
        "6-16": "Father's Day",
        "5-5": "Cinco de Mayo",
        "6-19": "Juneteenth",
        "9-7": "Labor Day",
        "10-12": "Columbus Day",
        "11-27": "Thanksgiving",
        "11-28": "Black Friday",
        "11-4": "Election Day",
    };

    //split the month-days to check for ranges
    const dateRangeKey = Object.keys(occasionColors).find(key => {
        if (key.includes("-") && key.split("-").length === 4) {
            const [m1, d1, m2, d2] = key.split("-").map(Number);
            return month === m1 && day >= d1 && day <= d2;
        }
        return key === dateKey;
    });
    const colors = occasionColors[dateRangeKey];
    if (colors) {
        setGradientColors(colors[0], colors[1], colors[2]);
        try {
            const notificationsEnabled = (typeof settings !== "undefined") ? settings.notifications !== false : true;
            const storageKey = 'lastOccasionNotification';
            const currentYear = now.getFullYear();
            let prev = null;
            try { prev = JSON.parse(localStorage.getItem(storageKey)); } catch (e) { prev = null; }
            if (prev && typeof prev.year === 'number' && prev.year < currentYear) {
                try { localStorage.removeItem(storageKey); } catch (e) { }
                prev = null;
            }
            const alreadyNotifiedThisYear = prev && prev.key === dateRangeKey && prev.year === currentYear;
            if (notificationsEnabled && window.notify && dateRangeKey && !alreadyNotifiedThisYear) {
                const name = occasionNames[dateRangeKey] || 'a special day';
                const header = `It's ${name}!`;
                const text = `Happy ${name}!`;
                window.notify(text, header, 'specialday.svg');
                try {
                    localStorage.setItem(storageKey, JSON.stringify({ key: dateRangeKey, year: currentYear }));
                } catch (e) {
                }
            }
        } catch (e) {
        }
    }
}
