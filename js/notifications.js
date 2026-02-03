(function () {
    const container = document.getElementById('notification');
    let hideTimer = null;

    function escapeHtml(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>"']/g, (s) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s]);
    }

    function hideNotification() {
        if (!container || !container.classList.contains('show')) return;
        container.classList.remove('show');
        //after transition remove content so it can be garbage collected and to restore pointer-events when hidden
        const onEnd = () => {
            container.innerHTML = '';
            container.removeEventListener('transitionend', onEnd);
        };
        container.addEventListener('transitionend', onEnd);
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    }

    window.notify = function notify(text = '', header = '', icon = 'info.svg', time = "6000") {
        try {
            const notificationsEnabled = (typeof settings !== 'undefined') ? String(settings.notifications_notificationsEnabled) === 'true' : true;
            if (!notificationsEnabled) return;
            if (!container) return console.warn('Notification container not found');
            const iconPath = (typeof icon === 'string' && icon.indexOf('/') === -1) ? `/asset/ui/${icon}` : icon;
            container.innerHTML = `\n<img class="notif-icon" src="${escapeHtml(iconPath)}" alt="${escapeHtml(header || 'notification')} icon">\n<div class="notif-body">\n<div class="notif-header">${escapeHtml(header)}</div>\n<div class="notif-text">${escapeHtml(text)}</div>\n</div>\n<button class="notif-close" aria-label="Close notification">&times;</button>\n`;
            const closeBtn = container.querySelector('.notif-close');
            if (closeBtn) closeBtn.addEventListener('click', hideNotification, { once: true });
            //show
            requestAnimationFrame(() => container.classList.add('show'));
            //default auto-hide after 6s
            if (hideTimer) clearTimeout(hideTimer);
            hideTimer = setTimeout(hideNotification, time);
            //for debug purposes incase i fuck something up
            if (window.location.href.indexOf("dev") > -1) {
                console.log('Notification shown: with body text "' + text + '", header text "' + header + '", icon name "' + icon + '", and a time of ' + time + " milliseconds.")
            }
            return hideNotification;
        } catch (e) {
            console.error('Notification error: ', e);
        }
    };
})();
