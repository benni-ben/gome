if (window.location.href.indexOf("dev") > -1) {
    window.developer = true;
    if (typeof notify !== 'undefined') {
        notify("Developer mode is now activated. Some events will now be shown in the console to help with debugging.","Developer mode activated", "info.svg", "6500");
    }
}