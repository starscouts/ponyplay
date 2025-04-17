window.alarmShown = false;

(async () => {
    window.alarmRingtones = [
        new Audio(URL.createObjectURL(new Blob([await (await fetch("/alarms/Awaken.ogg")).arrayBuffer()], { type: "audio/ogg" }))),
        new Audio(URL.createObjectURL(new Blob([await (await fetch("/alarms/Bright_morning.ogg")).arrayBuffer()], { type: "audio/ogg" }))),
        new Audio(URL.createObjectURL(new Blob([await (await fetch("/alarms/Fresh_start.ogg")).arrayBuffer()], { type: "audio/ogg" }))),
        new Audio(URL.createObjectURL(new Blob([await (await fetch("/alarms/Your_new_adventure.ogg")).arrayBuffer()], { type: "audio/ogg" })))
    ];

    for (let alarm of window.alarmRingtones) {
        alarm.loop = true;
    }
})();

window.loadingItems.push(() => {
    // TODO: Actually load alarms
    if (!localStorage.getItem("alarms")) localStorage.setItem("alarms", "[]");

    /*window.alarms = [
        {
            enabled: true,
            time: new Date(new Date().getTime() + 30000).getTime() - new Date(new Date().toISOString().split("T")[0]).getTime(),
            repeat: 0b1111111,
            alarm: 3
        },
        {
            enabled: true,
            time: new Date(new Date().getTime() + 60000).getTime() - new Date(new Date().toISOString().split("T")[0]).getTime(),
            repeat: 0b0111110,
            alarm: 2
        }
    ];*/
    window.alarms = JSON.parse(localStorage.getItem("alarms"));

    refreshAlarms();

    setInterval(() => {
        let list = window.alarms.filter(i => i.enabled).filter(i => ("0000000".substring(0, 7 - i.repeat.toString(2).length) + i.repeat.toString(2).substring(new Date().getDay() + 1 === 7 ? 0 : new Date().getDay() + 1, (new Date().getDay() + 1 === 7 ? 0 : new Date().getDay() + 1) + 1) === "1") || i.repeat === 0).sort((a, b) => a.time - b.time);
        let alarm = 0;

        if (!list[alarm] || !list[alarm].time) return;

        while (list[alarm] && new Date().getTime() - (list[alarm].time + new Date(new Date().toISOString().split("T")[0]).getTime()) > 1000) {
            alarm++;
        }

        if (!list[alarm] || !list[alarm].time) return;

        if (new Date().getTime() - (list[alarm].time + new Date(new Date().toISOString().split("T")[0]).getTime()) > 0 && new Date().getTime() - (list[alarm].time + new Date(new Date().toISOString().split("T")[0]).getTime()) <= 1000) {
            startAlarm(list[alarm].alarm ?? 3);
            list[alarm].enabled = false;
            refreshAlarms();
        }
    }, 1000);
});

function startAlarm(ringtone) {
    closeApp();
    window.alarmShown = true;
    document.getElementById("alarm").classList.add("show");
    window.alarmRingtones[ringtone].play();
}

function stopAlarm() {
    window.alarmShown = false;
    document.getElementById("alarm").classList.remove("show");

    for (let alarm of window.alarmRingtones) {
        alarm.pause();
        alarm.currentTime = 0;
    }
}

function refreshAlarms() {
    window.alarms = JSON.parse(localStorage.getItem("alarms"));

    if (window.alarms.filter(i => i.enabled).filter(i => ("0000000".substring(0, 7 - i.repeat.toString(2).length) + i.repeat.toString(2).substring(new Date().getDay() + 1 === 7 ? 0 : new Date().getDay() + 1, (new Date().getDay() + 1 === 7 ? 0 : new Date().getDay() + 1) + 1) === "1") || i.repeat === 0).length > 0) {
        let nextAlarmTime = alarms.filter(i => i.enabled).filter(i => ("0000000".substring(0, 7 - i.repeat.toString(2).length) + i.repeat.toString(2).substring(new Date().getDay() + 1 === 7 ? 0 : new Date().getDay() + 1, (new Date().getDay() + 1 === 7 ? 0 : new Date().getDay() + 1) + 1) === "1") || i.repeat === 0).sort((a, b) => a.time - b.time)[0].time + new Date(new Date().toISOString().split("T")[0]).getTime();
        document.getElementById("alarm-coming-time").innerText = fixed(new Date(nextAlarmTime).getHours(), 2) + ":" + fixed(new Date(nextAlarmTime).getMinutes(), 2);
        document.getElementById("alarm-coming").style.display = "";
    } else {
        document.getElementById("alarm-coming-time").innerText = "--:--";
        document.getElementById("alarm-coming").style.display = "none";
    }
}