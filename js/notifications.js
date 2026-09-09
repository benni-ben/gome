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
        const onEnd = () => {
            container.innerHTML = "";
            container.removeEventListener("transitionend", onEnd);
            isNotificationShowing = false;
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
        try {
            if (!container) {
                container = document.createElement('div');
                container.id = 'notification';
                document.body.appendChild(container);
            }

            if (isNotificationShowing) {
                notificationQueue.push([text, header, icon, time]);
                return;
            }

            isNotificationShowing = true;
            time = Number(time);
            if (isNaN(time) || time <= 0) time = 6000;

            const iconPath = (typeof icon === 'string' && icon.indexOf('/') === -1) ? `/asset/ui/${icon}` : icon;
            container.setAttribute('role', 'status');
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('aria-atomic', 'true');
            container.tabIndex = -1;
            container.innerHTML = `\n<img class="staticIcon" src="${escapeHtml(iconPath)}" alt="${escapeHtml(header || 'notification')} icon">\n<div class="notif-body">\n<div class="notif-header">${escapeHtml(header)}</div>\n<div class="notif-text">${escapeHtml(text)}</div>\n</div>\n<button class="notif-close" aria-label="Close notification">&times;</button>\n`;

            const closeBtn = container.querySelector('.notif-close');
            if (closeBtn) closeBtn.addEventListener("click", hideNotification, { once: true });

            requestAnimationFrame(() => {
                container.classList.add('show');
                try { container.focus(); } catch (e) { }
            });

            if (hideTimer) clearTimeout(hideTimer);
            hideTimer = setTimeout(hideNotification, time);

            if (typeof developer !== 'undefined' && developer === true) {
                console.log('Notification shown: with body text "' + text + '", header text "' + header + '", icon name "' + icon + '", and a time of ' + time + " milliseconds.")
            }

            return hideNotification;
        } catch (e) {
            console.error("Notification error: ", e);
        }
    };
})();