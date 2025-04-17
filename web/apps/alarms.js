window.alarms = window.parent.alarms;

while (window.alarms.length < 5) {
    window.alarms.push({
        enabled: false,
        time: 0,
        repeat: 0,
        alarm: 3
    });
}

document.getElementById("alarms").innerHTML = window.alarms.map(i => `
<div style="display: grid; grid-template-columns: 2.4vw 1fr 2fr 2fr; border-bottom: 1px solid var(--on-elevated);">
    <div></div>
    <div style="text-align: center;">
        <select style="text-align: center;">
            ${Array(24).fill(null).map((_, i) => `
                <option value="${i}">${window.parent.fixed(i, 2)}</option>
            `)}
        </select>:<select style="text-align: center;">
        ${Array(60).fill(null).map((_, i) => `
            <option value="${i}">${window.parent.fixed(i, 2)}</option>
        `)}
        </select>
    </div>
    <div style="text-align: center;">
        <select style="text-align: center;">
            <option value="3">Your New Adventure</option>
            <option value="1">Bright Morning</option>
            <option value="2">Fresh Start</option>
            <option value="0">Awaken</option>
        </select>
    </div>
    <div style="display: grid; grid-template-columns: repeat(7, 1fr);">
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
    </div>
</div>
`).join("");