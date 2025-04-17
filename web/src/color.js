function getAverageRGB(imgEl) {
    let blockSize = 5,
        defaultRGB = {r:0,g:0,b:0},
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return null;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        console.error(e);
        return null;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;
}

function rgb2hue(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let c   = max - min;
    let hue;
    let segment;
    let shift;

    if (c === 0) {
        hue = 0;
    } else {
        switch(max) {
            case r:
                segment = (g - b) / c;
                shift   = 0 / 60;
                if (segment < 0) {
                    shift = 360 / 60;
                }
                hue = segment + shift;
                break;
            case g:
                segment = (b - r) / c;
                shift   = 120 / 60;
                hue = segment + shift;
                break;
            case b:
                segment = (r - g) / c;
                shift   = 240 / 60;
                hue = segment + shift;
                break;
        }
    }

    return hue * 60;
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0){
        r = g = b = l;
    } else {
        let hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r, g, b) {
    let rh = r.toString(16);
    let gh = g.toString(16);
    let bh = b.toString(16);

    if (rh.length < 2) rh = "0" + rh;
    if (gh.length < 2) gh = "0" + gh;
    if (bh.length < 2) bh = "0" + bh;

    return rh + gh + bh;
}