window.appManagerCloseTimeout = null;
window.appOpen = false;

function closeApp() {
    appOpen = false;
    document.getElementById("app").classList.remove("show-native");
    document.getElementById("app").classList.remove("show");

    if (window.engine) window.engine.closeApp();

    window.appManagerCloseTimeout = setTimeout(() => {
        document.getElementById("app-header-title").innerText = "";
        document.getElementById("app-frame").src = "about:blank";
    }, 250);
}

function openApp(title, url, external) {
    appOpen = true;
    document.getElementById("app-header-title").innerText = title;
    document.getElementById("app").classList.add("show");

    if (window.engine && external) {
        document.getElementById("app").classList.add("show-native");
        window.engine.startApp(url);
    } else {
        document.getElementById("app-frame").src = url + "?_=" + Math.random();
    }
}