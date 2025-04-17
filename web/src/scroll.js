let tracking = false;
let startY = 0;

document.getElementById("swipe-zone").onmousedown = document.getElementById("swipe-zone").ontouchstart = (event) => {
    tracking = true;
    startY = (event.touches ? event.touches[0].clientY : event.clientY);

    document.getElementById("container").classList.remove("backing");
    document.getElementById("container").classList.remove("undeploying");
    document.getElementById("bg").style.opacity = "";
    document.getElementById("bg-blur").style.backdropFilter = "";
}

document.getElementById("swipe-zone").onmouseup = document.getElementById("swipe-zone").ontouchcancel = document.getElementById("swipe-zone").ontouchend = document.getElementById("swipe-zone").onmouseleave = (event) => {
    tracking = false;

    if (parseInt(document.getElementById("container").style.top.split("vh")[0]) > -(parseInt(localStorage.getItem("ui_deploy_trigger")))) {
        document.getElementById("container").style.top = "0vh";
        document.getElementById("container").classList.add("deployed");
    } else {
        document.getElementById("container").style.top = "-100vh";
        document.getElementById("container").classList.add("undeploying");
        document.body.classList.remove("deploying");
        document.getElementById("bg").style.opacity = "";
        document.getElementById("bg-blur").style.backdropFilter = "";
    }
}

document.getElementById("swipe-zone").onmousemove = document.getElementById("swipe-zone").ontouchmove = (event) => {
    if (tracking) {
        let triggerHeight = window.innerHeight / 2;

        let difference = (event.touches ? event.touches[0].clientY : event.clientY) - startY;
        if (difference < 0) difference = 0;

        let percentage = difference / triggerHeight;
        if (percentage > 1) percentage = 1;

        console.log((percentage * 100) + "vh", difference, triggerHeight);
        document.getElementById("container").style.top = -(100 - (percentage * 100)) + "vh";

        if (percentage > .05) {
            let scaleSubtracter = percentage / 2;
            let blurSubtracter = (percentage / 4) * 100;

            document.body.classList.add("deploying");
            document.getElementById("bg").style.opacity = (1 - scaleSubtracter).toString();
            if (localStorage.getItem("ui_deploy_blur") === "true") document.getElementById("bg-blur").style.backdropFilter = "blur(" + blurSubtracter + "px)";
        } else {
            document.body.classList.remove("deploying");
            document.getElementById("bg").style.opacity = "";
            document.getElementById("bg-blur").style.transform = "";
        }
    }
}

document.getElementById("container").onmousedown = document.getElementById("container").ontouchstart = (event) => {
    tracking = true;
    startY = (event.touches ? event.touches[0].clientY : event.clientY);

    document.getElementById("bg").style.opacity = "";
    document.getElementById("bg-blur").style.backdropFilter = "";
}

document.getElementById("container").onmouseup = document.getElementById("container").onmouseleave = document.getElementById("container").ontouchend = document.getElementById("container").ontouchcancel = (event) => {
    tracking = false;
    document.getElementById("container").classList.remove("backing");

    if (parseInt(document.getElementById("container").style.top.split("vh")[0]) > -(parseInt(localStorage.getItem("ui_deploy_trigger")))) {
        document.getElementById("container").style.top = "0vh";
        document.getElementById("container").classList.add("deployed");
    } else {
        document.getElementById("container").style.top = "-100vh";
        document.getElementById("container").classList.add("undeploying");
        document.body.classList.remove("deploying");
        document.getElementById("bg").style.opacity = "";
        document.getElementById("bg-blur").style.backdropFilter = "";
    }
}

document.getElementById("container").onmousemove = document.getElementById("container").ontouchmove = (event) => {
    if (tracking) {
        document.getElementById("container").classList.remove("deployed");
        document.getElementById("container").classList.add("backing");

        let triggerHeight = window.innerHeight / 2;

        let difference = startY - (event.touches ? event.touches[0].clientY : event.clientY);
        if (difference < 0) difference = 0;

        let percentage = difference / triggerHeight;
        if (percentage > 1) percentage = 1;
        percentage = 1 - percentage;

        console.log((percentage * 100) + "vh", -(100 - (percentage * 100)) + "vh", difference, triggerHeight);
        document.getElementById("container").style.top = -(100 - (percentage * 100)) + "vh";

        if (percentage > .05) {
            let scaleSubtracter = percentage / 2;
            let blurSubtracter = (percentage / 4) * 100;

            document.body.classList.add("deploying");
            document.getElementById("bg").style.opacity = (1 - scaleSubtracter).toString();
            if (localStorage.getItem("ui_deploy_blur") === "true") document.getElementById("bg-blur").style.backdropFilter = "blur(" + blurSubtracter + "px)";
        } else {
            document.body.classList.remove("deploying");
            document.getElementById("bg").style.opacity = "";
            document.getElementById("bg-blur").style.transform = "";
        }
    }
}