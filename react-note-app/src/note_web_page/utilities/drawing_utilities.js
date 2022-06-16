
/**
 * Draws a line on a context, using the current window dimensions in order to find the relative measurements.
 *
 * @param ctx - the canvas context on which to draw the line
 * @param startX - the x coordinate of the starting point
 * @param startY - the y coordinate of the starting point
 * @param endX - the x coordinate of the ending point
 * @param endY - the y coordinate of the ending point
 * @param width - the stroke width of the line
 * @param color - the color of the line
 * @param dashPattern - the dash pattern of the line
 */
export function drawLine(
    ctx,
    startX,
    startY,
    endX,
    endY,
    width,
    color,
    dashPattern
) {
    // set styles
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash(dashPattern);

    // create the line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);

    // draw line
    ctx.stroke();
    ctx.closePath();

    // reset defaults
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000";
    ctx.setLineDash([]);
}

/**
 * draws a circle on a canvas context.
 *
 * @param ctx - the context to be drawn on
 * @param centerX - the center x value of the circle
 * @param centerY - the center y value of the circle
 * @param radius - the radius of the circle
 * @param color - the color of the circle to be drawn
 */
export function drawCircle(ctx, centerX, centerY, radius, color) {
    // draw the circle
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    // reset defaults
    ctx.fillStyle = "#000";
}

/**
 * draws some text on a canvas context
 *
 * @param ctx - the context to be drawn on
 * @param textX - the x value of the start of the text
 * @param textY - the y value of the start of the text
 * @param text - the string value of the text
 * @param fontSize - the font size of the text
 * @param center - determines whether the text will be centered around the coordinate
 */
export function drawText(ctx, textX, textY, text, fontSize, center) {
    ctx.font = fontSize + "px Courier";
    if (center) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
    } else {
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
    }
    window.devicePixelRatio = 1;
    ctx.fillText(text, textX, textY);
}

/**
 * draws an arced curve between two points, diverted by a certain "overset" value
 *
 * @param ctx - the context to be drawn on
 * @param startX - the x value of a starting point
 * @param startY - the y value of a starting point
 * @param endX - the x value of the end point
 * @param endY - the y value of the end point
 * @param outset - the distance value of the "diversion"
 * @param width - the width of the arc line
 * @param color - the color of the arc line
 * @param dashPattern - the dash pattern of the arc line
 */
export function drawOutsetCurve(
    ctx,
    startX,
    startY,
    endX,
    endY,
    outset,
    width,
    color,
    dashPattern
) {
    // calculations
    const halfX = (endX - startX) / 2;
    const halfY = (endY - startY) / 2;
    const half_len = Math.sqrt(halfX * halfX + halfY * halfY);

    const perpendicularX = halfY * (outset / half_len);
    const perpendicularY = -halfX * (outset / half_len);
    const outsetX = startX + halfX + perpendicularX;
    const outsetY = startY + halfY + perpendicularY;

    // set style
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.setLineDash(dashPattern);

    // draw the circle
    ctx.beginPath();
    ctx.bezierCurveTo(startX, startY, outsetX, outsetY, endX, endY);
    ctx.stroke();
    ctx.closePath();

    // reset defaults
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000";
    ctx.setLineDash([]);
}

/**
 * Finds the average of a list of colors.
 * 
 * @param  {...string} colors a list of colors as 6-digit hex numbers
 * @returns a single hex number that is the average of all the colors
 */
export function averageColor(...colors) {
    console.log(colors);
    colors.forEach((e, i) => {
        console.log(e);
        if (e.charAt(0) == '#') {
            colors[i] = e.slice(1);
        }
    });
    const leadingZero = val => Number(val) < 10 ? '0' + val : val;
    const compSums = colors.reduce((rgb, color) => {
        const comps = color.match(/.{1,2}/g).map(comp => parseInt(comp, 16));
        return rgb.map((comp, i) => comp + comps[i]);
    }, [0, 0, 0]);
    return "#" + compSums.map(sum => leadingZero(Math.round(sum / colors.length)).toString(16)
    ).join('').toUpperCase();
};

/**
 * Generates a random hexadecimal color.
 * 
 * @param {string} light flag that determines if the returned color is light or dark
 * @returns {string} a random color
 */
export function randomColor(light) {
    const color = [0, 0, 0];

    if (light == null) {
        color.forEach((e, i) => { color[i] = Math.floor(256 * Math.random()); });
    } else if (light == "bright") {
        color.forEach((e, i) => { color[i] = 128 + Math.floor(128 * Math.random()); });
    } else if (light == "dark") {
        color.forEach((e, i) => { color[i] = Math.floor(128 * Math.random()); });
    }

    let hexColor = "#";
    color.forEach(e => {
        const component = e.toString(16);
        hexColor += component.length > 1 ? component : "0" + component;
    });

    return hexColor;
}