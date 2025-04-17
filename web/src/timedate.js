function fixed(number, digits) {
    number = Math.round(number);
    return "0".repeat(digits).substring(0, digits - number.toString().length) + number.toString();
}

document.getElementById("time").innerText = fixed(new Date().getHours(), 2) + ":" + fixed(new Date().getMinutes(), 2);
document.getElementById("time-sleep").innerText = fixed(new Date().getHours(), 2) + ":" + fixed(new Date().getMinutes(), 2);
document.getElementById("time-alarm").innerText = fixed(new Date().getHours(), 2) + ":" + fixed(new Date().getMinutes(), 2);
document.getElementById("date").innerText = (new Date().toDateString().split(" "))[0] + ", " + (new Date().toDateString().split(" "))[2] + " " + (new Date().toDateString().split(" "))[1];

setInterval(() => {
    document.getElementById("time").innerText = fixed(new Date().getHours(), 2) + ":" + fixed(new Date().getMinutes(), 2);
    document.getElementById("time-sleep").innerText = fixed(new Date().getHours(), 2) + ":" + fixed(new Date().getMinutes(), 2);
    document.getElementById("time-alarm").innerText = fixed(new Date().getHours(), 2) + ":" + fixed(new Date().getMinutes(), 2);
    document.getElementById("date").innerText = (new Date().toDateString().split(" "))[0] + ", " + (new Date().toDateString().split(" "))[2] + " " + (new Date().toDateString().split(" "))[1];
}, 1000);