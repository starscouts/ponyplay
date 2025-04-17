window.loadingItems = [];

function load() {
    for (let item of loadingItems) {
        item();
    }
}