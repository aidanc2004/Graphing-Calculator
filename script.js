let graph = document.getElementById("graph");
let ctx = graph.getContext("2d");

// width and height of the canvas
let width = 800;
let height = 600;

// range of x values
let xmin = -5;
let xmax = 5;
// range of y values
let ymin = -5;
let ymax = 5;

// draw the x and y axis
function drawAxes() {
    // position on the graph where x/y = 0
    let xZero = transformRange(0, {min: ymin, max: ymax}, {min: 0, max: height});
    let yZero = transformRange(0, {min: xmin, max: xmax}, {min: 0, max: width});

    // draw x axis
    ctx.beginPath();
    ctx.setLineDash([5, 10]);
    ctx.moveTo(0, xZero);
    ctx.lineTo(width, xZero);
    ctx.stroke();
    ctx.closePath();
    
    // draw y axis
    ctx.beginPath();
    ctx.moveTo(yZero, 0);
    ctx.lineTo(yZero, height);
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);
}

// used to scale of x and y values to match width and height of canvas
function transformRange(value, r1, r2) {
    var scale = (r2.max - r2.min) / (r1.max - r1.min);
    return (value - r1.min) * scale;
}

// test functions
let f = x => Math.pow(x, 2);
//let f = x => -Math.pow(x, 2);
//let f = x => (5 * Math.sin(x));
//let f = x => (x + 1) / (x - 1); // problems with horizontal asymptotes

ctx.lineWidth = 1;

ctx.scale(1,-1); // flip graph upside down so 0 is on the bottom
ctx.translate(0, -height); // fix position

// draw x and y axis
drawAxes();

// begin drawing functions
ctx.beginPath();

for (let i = xmin; i < xmax; i += 0.01) {
    let x = transformRange(i, {min: xmin, max: xmax}, {min: 0, max: width});
    let y = transformRange(f(i), {min: ymin, max: ymax}, {min: 0, max: height});

    ctx.lineTo(x, y)
}

ctx.stroke();