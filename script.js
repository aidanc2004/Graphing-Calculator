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

// test functions
let f = x => Math.pow(x, 2);
//let f = x => -Math.pow(x, 2);
//let f = x => (5 * Math.sin(x));
//let f = x => (x + 1) / (x - 1); // problems with horizontal asymptotes

// used to scale of x and y values to match width and height of canvas
var transformRange = (value, r1, r2) => {
    var scale = (r2.max - r2.min) / (r1.max - r1.min);
    return (value - r1.min) * scale;
}

ctx.lineWidth = 1;

// begin drawing functions
ctx.beginPath();

ctx.scale(1,-1); // flip graph upside down so 0 is on the bottom
ctx.translate(0, -height); // fix position

for (let i = xmin; i < xmax; i += 0.01) {
    let x = transformRange(i, {min: xmin, max: xmax}, {min: 0, max: width});
    let y = transformRange(f(i), {min: ymin, max: ymax}, {min: 0, max: height});

    ctx.lineTo(x, y)
}

ctx.stroke();