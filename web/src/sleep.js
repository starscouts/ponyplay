window.lastInteraction = new Date().getTime();
window.inhibitSleep = false;
window.sleeping = false;

document.body.onmousemove = document.body.onclick = document.body.ontouchmove = document.body.ontouchstart = () => {
    window.lastInteraction = new Date().getTime();
}

setInterval(() => {
    if (new Date().getTime() - window.lastInteraction > parseInt(localStorage.getItem("sleep_trigger_brightness"))) {
        window.inhibitSleep = false;
        document.getElementById("sleep").classList.remove("inhibited");
    }
});

function startInhibitSleep() {
    window.sleeping = false;
    document.getElementById("sleep").classList.add("inhibited");
    document.getElementById("sleep").classList.remove("show");
    window.inhibitSleep = true;
}

window.loadingItems.push(() => {
    let hasBrightness = false;
    let brightnessError = "INTERNAL_ERROR";

    if (window.engine && window.engine.getBrightness && window.engine.getSystemBrightness && window.engine.setBrightness) {
        try {
            window.engine.getBrightness();
            hasBrightness = true;
        } catch (e) {
            brightnessError = "INVALID_VALUE";
        }
    } else if (window.engine) {
        brightnessError = "INVALID_NATIVE_INTEGRATION";
    } else {
        brightnessError = "NATIVE_INTEGRATION_NOTFOUND";
    }

    if (!hasBrightness) {
        addWarning("[" + brightnessError + "] Unable to use light sensor, sleep mode and auto-brightness will be unavailable.");

        (async () => {
            if (navigator.userAgent.includes("Ponyplay/")) sendNotification("Ponyplay System", await renderIcon("system", true), "Unable to access light sensor", "Your display will not adjust its content based on ambient light", null, true);
        })();
    }

    setInterval(() => {
        if (hasBrightness && window.engine.getBrightness() < parseInt(localStorage.getItem("sleep_trigger_brightness")) && !window.inhibitSleep && !(window.appOpen || localStorage.getItem("sleep_disable_wakelock") === "true" || window.alarmShown)) {
            window.sleeping = true;
            document.getElementById("sleep").classList.add("show");
        } else {
            window.sleeping = false;
            document.getElementById("sleep").classList.remove("show");
        }
    });
});