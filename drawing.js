/*
drawing.js
Deals with drawing to the graph
*/

// canvas and context
const graph = document.getElementById("graph");
const ctx = graph.getContext("2d");

// width and height of the canvas
graph.width = window.innerWidth - (window.innerWidth * 0.20);
graph.height = window.innerHeight;

let width = graph.width;
let height = graph.height;

// range of x values
let xmin = -5;
let xmax = 5;
// range of y values
let ymin = -5;
let ymax = 5;

// array of all functions of graph
let functions = [];

// object of color codes
const colorCodes = {
    "black": "#000000",
    "grey": "#dddddd",
    "red": "#ff0000",
    "green": "#00ad22",
    "blue": "#0000ff",
    "orange": "#ff8a00",
    "pink": "#ff60fe",
    "yellow": "#d9ec00",
};

// array of colors to use for functions
const colors = [
    colorCodes["red"],
    colorCodes["green"],
    colorCodes["blue"],
    colorCodes["orange"],
    colorCodes["pink"],
    colorCodes["yellow"]
];

// when the window is resized, update width and height
window.addEventListener('resize', () => {
    graph.width = window.innerWidth - (window.innerWidth * 0.20);
    graph.height = window.innerHeight;

    width = graph.width;
    height = graph.height;

    // refresh graph
    setupGraph();
    drawGraph();
});

// scale x and y values to match width and height of canvas
function xScale(x) {
    return (x - xmin) * (width - 0) / (xmax - xmin);
}

function yScale(y) {
    return (y - ymin) * (height - 0) / (ymax - ymin);
}

// set up graph for adding functions
function setupGraph() {
    ctx.lineWidth = 2; // set default line width

    ctx.scale(1,-1); // flip graph upside down so 0 is on the bottom
    ctx.translate(0, -height); // fix position
}

// draw the x and y axis
function drawAxes() {
    // position on the graph where x or y = 0
    const xZero = yScale(0);
    const yZero = xScale(0);

    ctx.strokeStyle = colorCodes["black"];

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

// draw a grid on the graph
function drawGrid() {
    // position on the graph where x or y = 0
    const xZero = yScale(0);
    const yZero = xScale(0);

    // draw grid lines in grey
    ctx.strokeStyle = colorCodes["grey"];

    // x lines
    for (let i = xmin; i < xmax; i++) {
        let x = xScale(Math.ceil(i));
        
        ctx.beginPath()
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.closePath();
    }

    // y lines
    for (let i = ymin; i < ymax; i++) {
        let y = yScale(Math.ceil(i));

        ctx.beginPath()
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        ctx.closePath();
    }

    ctx.strokeStyle = colorCodes["black"];
}

// draw a function onto the graph
function drawFunction(f, color) {
    ctx.beginPath();

    ctx.strokeStyle = color;

    for (let i = xmin; i < xmax; i += 0.01) {
        let x = xScale(i);
        let y = yScale(f(i));

        ctx.lineTo(x, y)
    }

    ctx.stroke();

    ctx.closePath();

    ctx.strokeStyle = colorCodes["black"];
}

// draw all functions on the graph and the axes
function drawGraph() {
    // clear canvas
    ctx.clearRect(0, 0, width, height);

    drawGrid();

    // draw x and y axis
    drawAxes();

    console.log(functions)

    // begin drawing functions
    for (let key in functions) {
        let f = functions[key];
        let color;

        // if more functions than colors, use black
        if (key < colors.length) {
            color = colors[key];
        } else {
            color = colorCodes["black"];
        }

        drawFunction(f, color);
    }
}

