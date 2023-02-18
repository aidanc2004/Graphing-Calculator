let graph = document.getElementById("graph");
let ctx = graph.getContext("2d");

// width and height of the canvas
let width = 800;
let height = 600;

// range of x values
let xmin = -10;
let xmax = 10;
// range of y values
let ymin = -10;
let ymax = 10;

// test functions
//let f = x => Math.pow(x, 2);
let f = x => Math.sin(x) * 5 + 10;
//let f = x => (x + 1) / (x - 1); // problems with horizontal asymptotes

// scale of x and y values to match width and height of canvas
let xscale = width / (Math.abs(xmin) + Math.abs(xmax));
let yscale = height / (Math.abs(ymin) + Math.abs(ymax))

ctx.lineWidth = 1;

// begin drawing functions
ctx.beginPath();
for (let i = xmin; i < xmax; i += 0.1) {
    let x = i * xscale + width / 2; // calculate x value
    let y = (-f(i) * yscale + height); // calculate y value

    ctx.lineTo(x, y); // draw line to point
}
ctx.stroke();