window.dynamicColor = window.parent.dynamicColor;

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