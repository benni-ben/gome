
(function () {
    let container = document.getElementById("notification");
    let hideTimer = null;
    let isNotificationShowing = false;
    let notificationQueue = [];

    function escapeHtml(str) {
        if (typeof str !== "string") return '';
        return str.replace(/[&<>"']/g, (s) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[s]);
    }
    function hideNotification() {
        if (!container || !container.classList.contains("show")) return;
        container.classList.remove("show");
        //after transition remove content so it can be garbage collected and to restore pointer-events when hidden
        const onEnd = () => {
            container.innerHTML = "";
            container.removeEventListener("transitionend", onEnd);
            isNotificationShowing = false;
            //process queue if there are pending notifications
            if (notificationQueue.length > 0) {
                const nextNotification = notificationQueue.shift();
                window.notify(...nextNotification);
            }
        };
        container.addEventListener("transitionend", onEnd);
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    }
    window.notify = function notify(text = "", header = "", icon = "info.svg", time = 6000) {
        //in case i fuck something up
        if (typeof developer !== 'undefined' && developer === true) {
            console.log('notify() called - window.notifications:', typeof window.notifications !== 'undefined' ? window.notifications : 'undefined');
        }
        
        if (window.notifications === false) {
            if (typeof developer !== 'undefined' && developer === true) {
                console.log('notify() blocked: window.notifications is false');
            }
            return;
        }
        try {
            //if no container exists, make one
            if (!container) {
                container = document.createElement('div');
                container.id = 'notification';
                document.body.appendChild(container);
            }
            //queue the notification if one is already showing
            if (isNotificationShowing) {
                notificationQueue.push([text, header, icon, time]);
                return;
            }

            const notificationsEnabled = (typeof settings !== "undefined") ? settings.notifications !== false : true;
            if (!notificationsEnabled) {
                if (typeof developer !== 'undefined' && developer === true) {
                    console.log('notify() blocked: settings.notifications is false');
                }
                return;
            }
            isNotificationShowing = true;
            time = Number(time);
            if (isNaN(time) || time <= 0) time = 6000;
            const iconPath = (typeof icon === 'string' && icon.indexOf('/') === -1) ? `/asset/ui/${icon}` : icon;
            //accessibility attribs
            container.setAttribute('role', 'status');
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('aria-atomic', 'true');
            container.tabIndex = -1;
            container.innerHTML = `\n<img class="notif-icon" src="${escapeHtml(iconPath)}" alt="${escapeHtml(header || 'notification')} icon">\n<div class="notif-body">\n<div class="notif-header">${escapeHtml(header)}</div>\n<div class="notif-text">${escapeHtml(text)}</div>\n</div>\n<button class="notif-close" aria-label="Close notification">&times;</button>\n`;
            const closeBtn = container.querySelector('.notif-close');
            if (closeBtn) closeBtn.addEventListener("click", hideNotification, { once: true });
            //show
            requestAnimationFrame(() => {
                container.classList.add('show');
                try { container.focus(); } catch (e) {}
            });
            //default auto-hide after provided time
            if (hideTimer) clearTimeout(hideTimer);
            hideTimer = setTimeout(hideNotification, time);
            //for debugging purposes
            if (typeof developer !== 'undefined' && developer === true) {
                console.log('Notification shown: with body text "' + text + '", header text "' + header + '", icon name "' + icon + '", and a time of ' + time + " milliseconds.")
            }
            return hideNotification;
        } catch (e) {
            console.error("Notification error: ", e);
        }
    };
})();