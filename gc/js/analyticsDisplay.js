function createAnalyticsCell(title, value) {
    const cell = document.createElement("div");
    cell.id = "analyticsCell";
    cell.className = "analyticsCell";
    const titleText = document.createElement("span");
    titleText.textContent = title;
    cell.appendChild(titleText);
    titleText.id = "titleText";
    const patternDiv = document.createElement("div");
    patternDiv.id = "analyticsCellPattern";
    cell.appendChild(patternDiv);
    const valueElement = document.createElement("div");
    valueElement.textContent = value;
    valueElement.id = "value";
        cell.appendChild(patternDiv);

    cell.appendChild(valueElement);
    return cell;
}
function displayAnalyticsOverlay() {
    const container = document.getElementById("analyticsCellContainer");
    if (!container) return;
    const existingCells = container.querySelectorAll("[data-stat]");
    existingCells.forEach(cell => cell.remove());
    const data = Analytics.getSummaryReport();
    const stats = [
        {
            title: "Total Time Played",
            value: data.totalTimePlayed,
            stat: "totalTimePlayed"
        },
        {
            title: "Total Clicks",
            value: data.totalClicks,
            stat: "totalClicks"
        },
        {
            title: "Total Keys Pressed",
            value: data.totalKeysPresses,
            stat: "totalKeysPresses"
        },
        {
            title: "Most Visited Game",
            value: data.mostVisitedGame || "N/A",
            stat: "mostVisitedGame"
        },
        {
            title: "Total Sessions",
            value: data.totalSessionsCount,
            stat: "totalSessions"
        }
    ];

    stats.forEach(stat => {
        const cell = createAnalyticsCell(stat.title, stat.value);
        cell.setAttribute("data-stat", stat.stat);
        container.appendChild(cell);
        cell.style = "border-top: " + getRandomColor() + " 10px inset;";
    });
}
document.addEventListener("DOMContentLoaded", () => {
    displayAnalyticsOverlay();
});
