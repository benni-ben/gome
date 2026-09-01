//notify(text,header,icon,time)
if (window.location.href.indexOf("dev") > -1) {
  notify(
    "Developer mode is now activated. Some events will now be shown in the console to help with debugging.",
    "Developer mode activated",
    "info.svg",
    "6500",
  );
  const developer = true;
  document.querySelectorAll("*").forEach((element) => {
    element.addEventListener("click", () => {
      console.log(element);
    });
  });
}
if (window.location.href.indexOf("reload") > -1) {
  setInterval(() => {
    location.reload();
  }, 500);
}
