/**
 * Returns a random number in a set range.
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 */
function randomNumber(min, max) {
    if (min == max) {
        return min;
    }
    else {
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }
}
/**
 * Makes a random hexedecimal color.
 */
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
/**
 * Stores the last version that was accessed.
 */
function storeLastVersionAcessed() {
    if (localStorage.getItem("lastVersionAccessed") !== currentVersion) {
        if (typeof notify !== 'undefined') {
            notify("Gome has updated! The following changes were made: " + changes, "Gome has updated to version " + currentVersion + "!", "specialday.svg", "15000");
        }
        localStorage.setItem("lastVersionAccessed", currentVersion);
    }
}
/**
 * Sends feedback using the netlify functions API. 
 *
 * @param {string} message The message to send through the API. 
 * @return {*} Returns the response. 
 */
async function sendFeedback(message) {
    const response = await fetch("https://gomestable.netlify.app/.netlify/functions/discord-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: message })
    });
    return response.ok;
}
/**
 * Saves through localStorage.
 *
 * @param {*} key Storage key.
 * @param {*} value Key value.
 */
function localStorageSave(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
/**
 * Loads a localStorage value.
 *
 * @param {string} key The key to get the value from.
 * @param {boolean} jsonParse A boolean value, whether to parse the localStorage value as JSON. 
 * @return {*} 
 */
function localStorageLoad(key, jsonParse) {
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