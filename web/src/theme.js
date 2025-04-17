window.loaded = false;

function setBackground(url) {
    const img = document.createElement("img");

    img.onload = () => {
        document.getElementById("bg").style.backgroundImage = 'url("' + url.replaceAll('"', '\\"') + '")';

        let rgb = getAverageRGB(img);
        let hue = rgb2hue(rgb.r, rgb.g, rgb.b);

        window.dynamicColor = {
            _raw: {...rgb, hue: hue},
            text: rgbToHex(...hslToRgb(hue / 360, 0.35, 0.85)),
            surface: rgbToHex(...hslToRgb(hue / 360, 0.35, 0.25)),
            bg: rgbToHex(...hslToRgb(hue / 360, 0.35, 0.15)),
            elevated: rgbToHex(...hslToRgb(hue / 360, 0.35, 0.35)),
            onSurface: rgbToHex(...hslToRgb(hue / 360, 0.45, 0.75)),
            onElevated: rgbToHex(...hslToRgb(hue / 360, 0.45, 0.65))
        }

        document.getElementById("dynamic-theme").innerText = `
        :root {
            --text-color: #${window.dynamicColor.text};
            --surface-bg: #${window.dynamicColor.surface};
            --elevated-bg: #${window.dynamicColor.elevated};
            --bg: #${window.dynamicColor.bg};
            --on-surface: #${window.dynamicColor.onSurface};
            --on-elevated: #${window.dynamicColor.onElevated};
        }
        `;

        (async () => {
            document.getElementById("app-header-icon").src = await renderIcon("close", false);
            document.getElementById("alarm-coming-icon").src = await renderIcon("alarms", false);
            document.getElementById("app-6-icon-img").src = await renderIcon("settings", true);
            document.getElementById("app-1-icon-img").src = await renderIcon("installer", true);
            document.getElementById("app-2-icon-img").src = await renderIcon("alarms", true);
            document.getElementById("app-3-icon-img").src = await renderIcon("face", true);
            document.getElementById("app-5-icon-img").src = await renderIcon("weather", true);
            document.getElementById("app-4-icon-img").src = await renderIcon("ponypush", true);

            if (!window.loaded) {
                let defaults = await (await fetch("/settings.json?_" + Math.random())).json();

                for (let setting of defaults) {
                    if (!localStorage.getItem(setting.name)) localStorage.setItem(setting.name, setting.default);
                }

                load();
                window.loaded = true;
            }
        })();
    }

    img.src = url;
}

async function renderIcon(icon, surfaced) {
    return "data:image/svg+xml;base64," + btoa((await (await fetch("/icons/" + icon + ".svg")).text()).replace('width="48">', 'width="48" fill="#' + (surfaced ? window.dynamicColor.surface : window.dynamicColor.text) + '">').replace('#777777', '#' + (surfaced ? window.dynamicColor.surface : window.dynamicColor.text)));
}

setBackground("/img/2023/8/12/3181099.jpg");