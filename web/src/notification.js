function sendNotification(app, icon, title, description, image, persistent) {
    let id = crypto.randomUUID();

    document.getElementById("notifications").innerHTML = `
    <div class="notification" id="notification-${id}" style="margin-bottom: 1.5vw; transition: opacity 500ms; opacity: 0;">
        <div class="notification-header">
            <img class="notification-icon" ${icon ? `src="${icon}"` : ""}>
            <span class="notification-application">${app ?? "System"}</span>
        </div>
        <div class="notification-content">
            ${title ? `<div class="notification-title">${title}</div>` : ""}
            ${description ? `<div class="notification-text">${description}</div>` : ""}
            ${image ? `<img alt="Image." src="${image}" class="notification-image">` : ""}
        </div>
    </div>
    ` + document.getElementById("notifications").innerHTML;

    setTimeout(() => {
        document.getElementById("notification-" + id).style.opacity = "1";

        if (!persistent) {
            setTimeout(() => {
                document.getElementById("notification-" + id).style.opacity = "0";

                setTimeout(() => {
                    document.getElementById("notification-" + id).outerHTML = "";
                }, 500);
            }, parseInt(localStorage.getItem("notification_duration")));
        }
    }, 100);

    return id;
}

window.loadingItems.push(async () => {
    sendNotification("Ponyplay System", await renderIcon("system", true), "Alarms are currently experimental", "Expect alarms to not go off when needed or to encounter other issues related to alarms.", null, false);
});