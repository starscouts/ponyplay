window.loadingItems.push(() => {
    const width = 320;
    let height = 0;
    let streaming = false;

    let video = null;
    let canvas = null;
    let photo = null;

    function startup() {
        video = document.getElementById("video");
        canvas = document.getElementById("canvas");
        photo = document.getElementById("photo");

        if (localStorage.getItem("ambienteq_filter_enable") === "false") {
            document.getElementById("filter").style.display = "none";
            return;
        }

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
            })
            .catch(async (err) => {
                console.error(`An error occurred: ${err}`);
                document.getElementById("filter").style.display = "none";
                addWarning("[CAMERA_ERROR] Unable to use camera, ambient lighting will be unavailable. See console for details.");
                if (navigator.userAgent.includes("Ponyplay/")) sendNotification("Ponyplay System", await renderIcon("system", true), "Unable to access camera", "Face unlock and Ambient Brightness will not work", null, true);
            });

        video.addEventListener(
            "canplay",
            (ev) => {
                if (!streaming) {
                    height = video.videoHeight / (video.videoWidth / width);

                    video.setAttribute("width", width);
                    video.setAttribute("height", height);
                    canvas.setAttribute("width", width);
                    canvas.setAttribute("height", height);
                    streaming = true;
                }
            },
            false,
        );

        clearphoto();
    }

    function clearphoto() {
        const context = canvas.getContext("2d");
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
    }

    function takepicture() {
        const context = canvas.getContext("2d");

        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            const data = canvas.toDataURL("image/png");
            photo.setAttribute("src", data);
        } else {
            clearphoto();
        }
    }

    window.addEventListener("load", startup, false);

    setInterval(() => {
        takepicture();

        if (window.engine && localStorage.getItem("ambienteq_brightness_enable") === "true") {
            if (!window.sleeping || localStorage.getItem("ambienteq_add_whilesleep") === "true") {
                if (Math.abs(window.engine.getBrightness() - window.engine.getSystemBrightness()) > 10) window.engine.setBrightness(window.engine.getBrightness() + parseInt(localStorage.getItem("ambianteq_brightness_add")));
            } else {
                if (Math.abs(window.engine.getBrightness() - window.engine.getSystemBrightness()) > 10) window.engine.setBrightness(window.engine.getBrightness());
            }
        }
    }, 2000);

    document.getElementById("photo").onload = () => {
        let rgb = Object.values(getAverageRGB(document.getElementById("photo")));
        document.getElementById("rgb").innerText = rgb2hue(rgb[0], rgb[1], rgb[2]).toFixed(2);
        document.getElementById("sq1").style.backgroundColor = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
        document.getElementById("sq2").style.backgroundColor = document.getElementById("filter").style.backgroundColor = "hsl(" + rgb2hue(rgb[0], rgb[1], rgb[2]) + "deg, 100%, 50%)";

        let opacity = (rgb.reduce((a, b) => a + b) / rgb.length) / 255;
        if (opacity < parseFloat(localStorage.getItem("sleep_minimum_opacity"))) opacity = parseFloat(localStorage.getItem("sleep_minimum_opacity"));

        document.getElementById("time-sleep").style.opacity = opacity.toString();
    }

    startup();
});