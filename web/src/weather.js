window.loadingItems.push(() => {
    window.latitude = 0;
    window.longitude = 0;

    navigator.geolocation.getCurrentPosition(async (pos) => {
        window.latitude = pos.coords.latitude;
        window.longitude = pos.coords.longitude;

        setInterval(() => {
            refreshWeather();
        }, parseInt(localStorage.getItem("weather_refresh_interval")));

        refreshWeather();
    }, async (error) => {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                addWarning("[GEO_PERMISSION_DENIED] Permission to use location was denied, weather will be unavailable.");
                if (navigator.userAgent.includes("Ponyplay/")) sendNotification("Ponyplay System", await renderIcon("system", true), "Unable to access location", "Permission to access your location was denied", null, true);
                break;
            case error.POSITION_UNAVAILABLE:
                addWarning("[GEO_POSITION_UNAVAILABLE] Gathering a location failed, weather will be unavailable.");
                if (navigator.userAgent.includes("Ponyplay/")) sendNotification("Ponyplay System", await renderIcon("system", true), "Unable to access location", "Ponyplay was unable to figure out your physical position", null, true);
                break;
            case error.TIMEOUT:
                addWarning("[GEO_TIMEOUT] Gathering a location timed out, weather will be unavailable.");
                if (navigator.userAgent.includes("Ponyplay/")) sendNotification("Ponyplay System", await renderIcon("system", true), "Unable to access location", "Ponyplay was unable to access your location in time", null, true);
                break;
            default:
                addWarning("[GEO_UNKNOWN_ERROR] An unknown error occurred while gathering a location, weather will be unavailable.");
                if (navigator.userAgent.includes("Ponyplay/")) sendNotification("Ponyplay System", await renderIcon("system", true), "Unable to access location", "An unknown error occurred while gathering your location", null, true);
                break;
        }

        if (localStorage.getItem("weather_iplocation_fallback") === "true") {
            let location = (await (await fetch("https://ipinfo.io/json")).json())['loc'].split(",").map(i => parseFloat(i));

            window.latitude = location[0];
            window.longitude = location[1];

            setInterval(() => {
                refreshWeather();
            }, parseInt(localStorage.getItem("weather_refresh_interval")));

            refreshWeather();
        }
    });

    async function refreshWeather() {
        try {
            window.weather = await (await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + window.latitude + "&lon=" + window.longitude + "&appid=" + localStorage.getItem("openweathermap_api_key") + "&units=metric")).json();
            window.weatherIcons = await (await fetch("/weather/list.json")).json();

            document.getElementById("temperature").innerText = Math.round(window.weather['main']['temp']) + "°";
            document.getElementById("weather").src = "/weather/" + (window.weatherIcons.includes(window.weather.weather[0].id + window.weather.weather[0].icon.substring(2, 3) + ".png") ? window.weather.weather[0].id + window.weather.weather[0].icon.substring(2, 3) + ".png" : window.weather.weather[0].icon + ".png");
        } catch (e) {}
    }
});