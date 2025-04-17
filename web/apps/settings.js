(async () => {
    window.settings = await (await fetch("/settings.json?_" + Math.random())).json();
    window.oldSettings = {};

    for (let setting of window.settings) {
        oldSettings[setting.name] = localStorage.getItem(setting.name);
    }

    document.getElementById("settings").innerHTML = settings.sort((a, b) => ('' + a.name).localeCompare(b.name)).map(setting => `<div style="display: grid; grid-gap: 1vw; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--on-elevated);">
        <div style="border-right: 1px solid var(--on-elevated); margin-left: 1vw;">${setting.name}</div>
        <input id="setting--${setting.name}" type="text" value="${setting.secret ? '' : (localStorage.getItem(setting.name) ?? setting.default)}" ${setting.secret ? 'placeholder="(no change)"' : ''} style="border: none; font-size: 2.4vw; outline: none; background: transparent;" spellcheck="false" autocapitalize="off" autocomplete="off" onchange="updateSetting('${setting.name}');">
    </div>`).join("");
})();

function updateSetting(name) {
    if (window.settings.filter(i => i.name === name)[0].secret) {
        if (document.getElementById("setting--" + name).value.trim() !== "") {
            localStorage.setItem(name, document.getElementById("setting--" + name).value.trim());
        } else {
            if (window.oldSettings[name]) {
                localStorage.setItem(name, window.oldSettings[name]);
            } else {
                localStorage.setItem(name, window.settings.filter(i => i.name === name)[0].default);
                document.getElementById("setting--" + name).value = window.settings.filter(i => i.name === name)[0].default;
            }
        }
    } else {
        if (document.getElementById("setting--" + name).value.trim() !== "") {
            localStorage.setItem(name, document.getElementById("setting--" + name).value.trim());
        } else {
            localStorage.setItem(name, window.settings.filter(i => i.name === name)[0].default);
            document.getElementById("setting--" + name).value = window.settings.filter(i => i.name === name)[0].default;
        }
    }
}