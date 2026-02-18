function randomNumber(min, max) {
    if (min == max) {
        return min;
    }
    else {
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function storeLastVersionAcessed() {
    if (localStorage.getItem("lastVersionAccessed") !== currentVersion) {
        if (typeof notify !== 'undefined') {
            notify("Gome has updated! The following changes were made: " + changes, "Gome has updated to version " + currentVersion + "!", "specialday.svg", "15000");
        }
        localStorage.setItem("lastVersionAccessed", currentVersion);
    }
}

async function sendFeedback(message){
    const response = await fetch("https://gomestable.netlify.app/.netlify/functions/discord-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: message })
    });
    return response.ok;
}
function localStorageSave(key,value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function localStorageLoad(key,jsonParse) {
    const value = localStorage.getItem(key);
    try {
        if (jsonParse == true) {
            return JSON.parse(value);
        }
        else {
            return value;
        }
    } catch (e) {
        console.error("Oh no... it looks like we ran into an error... failed to save the key: ", key, e);
        return null;
    }
}