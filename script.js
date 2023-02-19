let graph = document.getElementById("graph");
let ctx = graph.getContext("2d");

// width and height of the canvas
let width = graph.width;
let height = graph.height;

// range of x values
let xmin = -5;
let xmax = 5;
// range of y values
let ymin = -5;
let ymax = 5;

// draw the x and y axis
function drawAxes() {
    // position on the graph where x or y = 0
    let xZero = yScale(0);
    let yZero = xScale(0);

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

function drawFunction(f, color) {
    ctx.beginPath();

    ctx.strokeStyle = color;

    for (let i = xmin; i < xmax; i += 0.01) {
        let x = xScale(i);
        let y = yScale(f(i));

        ctx.lineTo(x, y)
    }

    ctx.stroke();
}

// scale x and y values to match width and height of canvas
function xScale(x) {
    return (x - xmin) * (width - 0) / (xmax - xmin);
}

function yScale(y) {
    return (y - ymin) * (height - 0) / (ymax - ymin);
}

// test functions
let functions = [
    f = x => Math.pow(x, 2),
    g = x => (5 * Math.sin(x)),
    h = x => (x + 1) / (x - 1), // problems with horizontal asymptotes
]

let colors = ["#ff0000", "#00ad22", "#0000ff"];

ctx.lineWidth = 2;

ctx.scale(1,-1); // flip graph upside down so 0 is on the bottom
ctx.translate(0, -height); // fix position

// draw x and y axis
drawAxes();

// begin drawing functions
for (let key in functions) {
    let f = functions[key];
    let color = colors[key];

    drawFunction(f, color);
}

