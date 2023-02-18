let graph = document.getElementById("graph");
let ctx = graph.getContext("2d");

let width = 800;
let height = 600;

let xmin = -5;
let xmax = 5;

let ymin = 0;
let ymax = 10;

// simple function
let f = x => Math.pow(x, 2);
//let g = x => Math.sin(x)

let xscale = width / (Math.abs(xmin) + xmax);
let yscale = height / (ymin + ymax)

ctx.lineWidth = 1;

ctx.beginPath();
for (let i = xmin; i < xmax; i += 0.1) {
    let x = i * xscale + width / 2;
    let y = (-f(i) * yscale + height);

    ctx.lineTo(x, y);
}
ctx.stroke();