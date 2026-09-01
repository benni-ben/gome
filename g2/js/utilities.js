/**
 * Returns a random number in a set range.
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 */
window.randomNumber = function randomNumber(min, max) {
    if (min == max) {
        return min;
    }
    else {
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }
}
/**
 * Makes a random RGB color, with minimum and maximum values for each color(red, green, blue). Defaults to a range of 0-255 for all colors if no paramters are set.
 * @param {number} rmin Minimum red value.
 * @param {number} rmax Maximum red value.
 * @param {number} gmin Minimum green value.
 * @param {number} gmax Maximum green value.
 * @param {number} bmin Minimum blue value.
 * @param {number} bmax Maximum blue value.
*/
function getRandomColor(rmin = 0, rmax = 255, gmin = 0, gmax = 255, bmin = 0, bmax = 255) {
    var red = randomNumber(rmin, rmax);
    var green = randomNumber(gmin, gmax);
    var blue = randomNumber(bmin, bmax);
    return "(" + red + "," + green + "," + blue + ")";
}
/**
 * Stores the last version that was accessed.
 */
function storeLastVersionAcessed() {
    if (localStorage.getItem("lastVersionAccessed") !== currentVersion) {
        if (typeof notify !== 'undefined') {
            notify("Gome has updated! The following changes were made: " + changes, "Gome has updated to version " + currentVersion + "!", "specialday.svg", "25000");
        }
        localStorage.setItem("lastVersionAccessed", currentVersion);
    }
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
/**
 * 
 * @param {string} thumbnail The image source for average color extraction.
 * @returns The RGB average color.
 */
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
            let r = 0,
                g = 0,
                b = 0;
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
        img.onerror = () => resolve("rgba(128, 128, 128, 1)");
    });
}
