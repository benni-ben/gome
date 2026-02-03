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
        notify("Gome has updated! The following changes were made: " + changes, "Gome has updated to version " + currentVersion + "!", "specialday.svg", "15000")
        localStorage.setItem("lastVersionAccessed", currentVersion);
    }
}
