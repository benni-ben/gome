const Analytics = {
    data: {
        totalTimePlayed: 0,
        totalClicks: 0,
        totalKeysPressed: 0,
        gamesVisited: {},   //{ gameName: visitCount }
        mostVisitedGame: null,
        sessionStartTime: null,
        dailyStats: {}, //{ YYYY-MM-DD:{ clicks, keys, timePlayed}}
        firstVisit: null,
        lastVisit: null,
        totalSessions: 0,
    },
    init() {
        this.loadData();
        this.setupEventListeners();
        this.startSession();
        console.log("Analytics initialized");
    },
    startSession() {
        this.data.sessionStartTime = Date.now();
        this.data.totalSessions = (this.data.totalSessions || 0) + 1;
        this.data.lastVisit = new Date().toISOString();
        if (!this.data.firstVisit) {
            this.data.firstVisit = new Date().toISOString();
        }
        this.saveData();
    },
    trackClick(target) {
        this.data.totalClicks++;
        this.updateDailyStats('clicks', 1);
        this.saveData();
    },
    trackKeyPress(key) {
        this.data.totalKeysPressed++;
        this.updateDailyStats('keys', 1);
        this.saveData();
    },
    trackGameVisit(gameName) {
        if (!gameName) return;

        if (!this.data.gamesVisited[gameName]) {
            this.data.gamesVisited[gameName] = 0;
        }
        this.data.gamesVisited[gameName]++;
        this.updateMostVisitedGame();
        this.saveData();

        console.log(`Game visited: ${gameName} (${this.data.gamesVisited[gameName]} times)`);
    },
    updateMostVisitedGame() {
        let maxVisits = 0;
        let mostVisited = null;

        for (const [gameName, visits] of Object.entries(this.data.gamesVisited)) {
            if (visits > maxVisits) {
                maxVisits = visits;
                mostVisited = gameName;
            }
        }

        this.data.mostVisitedGame = mostVisited;
    },

    updateDailyStats(statType, value) {
        const today = new Date().toISOString().split('T')[0];

        if (!this.data.dailyStats[today]) {
            this.data.dailyStats[today] = {
                clicks: 0,
                keys: 0,
                timePlayed: 0,
                gamesVisited: {}
            };
        }

        if (statType === 'clicks') {
            this.data.dailyStats[today].clicks += value;
        } else if (statType === 'keys') {
            this.data.dailyStats[today].keys += value;
        } else if (statType === 'time') {
            this.data.dailyStats[today].timePlayed += value;
        }
    },
    calculateSessionTime() {
        if (this.data.sessionStartTime) {
            const sessionDuration = Date.now() - this.data.sessionStartTime;
            this.data.totalTimePlayed += sessionDuration;
            this.updateDailyStats('time', sessionDuration);
            this.data.sessionStartTime = Date.now();
            this.saveData();
            return sessionDuration;
        }
        return 0;
    },
    getData() {
        return {
            ...this.data,
            formattedTotalTime: this.formatTime(this.data.totalTimePlayed),
            formattedSessionTime: this.formatTime(
                this.data.sessionStartTime ? Date.now() - this.data.sessionStartTime : 0
            )
        };
    },
    getDailyStats(date) {
        return this.data.dailyStats[date] || null;
    },
    getGameStats() {
        return this.data.gamesVisited;
    },
    getTopGames(n = 5) {
        const sorted = Object.entries(this.data.gamesVisited)
            .sort((a, b) => b[1] - a[1])
            .slice(0, n);

        return sorted.map(([gameName, visits]) => ({
            gameName,
            visits
        }));
    },
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    },
    saveData() {
        localStorageSave('gomeAnalytics', this.data);
    },
    loadData() {
        const saved = localStorageLoad('gomeAnalytics', true);
        if (saved) {
            this.data = saved;
        }
    },
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            this.trackClick(e.target);
        }, { passive: true });
        document.addEventListener('keydown', (e) => {
            this.trackKeyPress(e.key);
        }, { passive: true });
        window.addEventListener('beforeunload', () => {
            this.calculateSessionTime();
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.calculateSessionTime();
            } else {
                this.startSession();
            }
        });
    },
    resetData() {
        this.data = {
            totalTimePlayed: 0,
            totalClicks: 0,
            totalKeysPressed: 0,
            gamesVisited: {},
            mostVisitedGame: null,
            sessionStartTime: Date.now(),
            dailyStats: {},
            firstVisit: null,
            lastVisit: null,
            totalSessions: 0,
        };
        this.saveData();
        console.log("Analytics data reset");
    },
    exportData() {
        return JSON.stringify(this.getData(), null, 2);
    },
    getSummaryReport() {
        const data = this.getData();
        return {
            totalTimePlayed: data.formattedTotalTime,
            totalClicks: data.totalClicks,
            totalKeysPresses: data.totalKeysPressed,
            mostVisitedGame: data.mostVisitedGame,
            totalSessionsCount: data.totalSessions,
            firstVisit: data.firstVisit,
            lastVisit: data.lastVisit,
            topGames: this.getTopGames(5)
        };
    }
};
function exportAnalyticsData() {
    try {
        const jsonString = Analytics.exportData();
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `gome-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        if (typeof notify !== 'undefined') {
            notify("Analytics exported successfully!", "Export Complete", "check.svg", "3000");
        }
    } catch (e) {
        console.error("Failed to export analytics:", e);
        if (typeof notify !== 'undefined') {
            notify("Failed to export analytics. Check console for details.", "Export Failed", "sad.svg", "3000");
        }
    }
}

function resetAnalyticsData() {
    if (confirm("Are you sure you want to reset all analytics data? This cannot be undone.")) {
        Analytics.resetData();
        displayAnalyticsOverlay(); // Refresh the display

        if (typeof notify !== 'undefined') {
            notify("Analytics data has been reset.", "Reset Complete", "check.svg", "3000");
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Analytics.init();
});
