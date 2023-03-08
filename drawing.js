/*
drawing.js
Deals with drawing to the graph
*/

// canvas and context
const graph = document.getElementById("graph");
const ctx = graph.getContext("2d");

// width of user interface
const uiWidth = document.getElementById("ui").clientWidth;

// width and height of the canvas
graph.width = window.innerWidth - uiWidth;
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

// current point clicked, set to (-100, -100) by default
// so it doesnt show on graph
let point = [-100, -100];

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

// scale from mouse position to graph coordinate 
const xUpscale = x => x * (xmax - xmin) / width + xmin;
const yUpscale = y => y * (ymax - ymin) / height + ymin;

// show the point clicked on screen
graph.addEventListener("click", (e) => {
    // get mouse x and y
    const x = e.clientX - uiWidth;
    const y = e.clientY;

    // mouse y position on graph
    const mouseY = -yUpscale(y);

    // get all function outputs at x
    let outputs = [];
    for (let i = 0; i < functions.length; i++) {
        outputs[i] = functions[i](xUpscale(x));
    }

    // get closest value to the mouses y position
    let closest = outputs.reduce((prev, curr) => {
        return ((Math.abs(curr - mouseY) < Math.abs(prev - mouseY)) ? curr : prev);
    });

    // set point coordinate to first function in array
    point = [xUpscale(x), closest];

    drawGraph(); // redraw graph to clear previous point

    drawPoint(); // draw new point
});

// draw the clicked point onto the screen
function drawPoint() {
    const [x, y] = point;

    // round x and y to 2 decimal points
    const xRound = x.toFixed(2);
    const yRound = y.toFixed(2);

    // flip graph back to the original configuration so that the
    // text is normal
    ctx.scale(1,-1);
    ctx.translate(0, -height)

    ctx.fillText(`(${xRound}, ${yRound})`, xScale(x), yScale(-y));
    
    ctx.scale(1,-1);
    ctx.translate(0, -height);
}

// when the window is resized, update width and height
window.addEventListener('resize', () => {
    graph.width = window.innerWidth - uiWidth;
    graph.height = window.innerHeight;

    width = graph.width;
    height = graph.height;

    // refresh graph
    setupGraph();
    drawGraph();
});

// scale x and y values to match width and height of canvas
const xScale = x => (x - xmin) * (width - 0) / (xmax - xmin);
const yScale = y => (y - ymin) * (height - 0) / (ymax - ymin);

// set line width, then scale and translate graph so y goes upwards instead of down
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
    // draw grid lines in grey
    ctx.strokeStyle = colorCodes["grey"];

    // x lines
    for (let i = xmin; i < xmax; i++) {
        // only get x at whole numbers
        let x = xScale(Math.ceil(i));
        
        ctx.beginPath()
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.closePath();
    }

    // y lines
    for (let i = ymin; i < ymax; i++) {
        // only get y at whole numbers
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
    
    drawAxes(); // draw x and y axis

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

    drawPoint(); // draw the selected point
}

