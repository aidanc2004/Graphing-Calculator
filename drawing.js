/*
 * drawing.js
 * Handles drawing to the graph
 */

// canvas and context
const graph = document.getElementById("graph");
const ctx = graph.getContext("2d");

// width of user interface
const uiWidth = document.getElementById("ui").clientWidth;

// width and height of the canvas
graph.width = window.innerWidth - uiWidth - 1;
graph.height = window.innerHeight - 1;

let width = graph.width;
let height = graph.height;

// range of x and y values
let xrange = [-5, 5];
let yrange = [-5, 5];

// array of all functions of graph
let functions = [];

function createFunction(equation, func, name, color) {
    return {
        equation,
        func,
        name,
        color,
    };
}

// current point clicked, set to (-100, -100) by default
// so it doesnt show on graph
let point = {
    x: -100,
    y: -100,
    color: "",
}

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
    "white": "#ffffff",
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

// scale x and y values to match width and height of canvas
const xGraphToCanvas = x => (x - xrange[0]) * (width - 0) / (xrange[1] - xrange[0]);
const yGraphToCanvas = y => (y - yrange[0]) * (height - 0) / (yrange[1] - yrange[0]);

// scale from mouse position to graph coordinate 
const xMouseToGraph = x => x * (xrange[1] - xrange[0]) / width + xrange[0];
const yMouseToGraph = y => y * (yrange[1] - yrange[0]) / height + yrange[0];

// show the point clicked on screen
graph.addEventListener("click", (e) => {
    // if there are no current functions, just return
    if (functions.length == 0) return;

    // get mouse x and y
    const x = e.clientX - uiWidth;
    const y = e.clientY;

    // mouse y position on graph
    const mouseY = -yMouseToGraph(y);

    // get all function outputs at x
    let outputs = [];
    for (let i = 0; i < functions.length; i++) {
        outputs[i] = functions[i].func(xMouseToGraph(x));
    }

    let closest = outputs.reduce((curr, prev) => {
        return ((Math.abs(curr - mouseY) < Math.abs(prev - mouseY)) ? curr : prev);
    });

    // set point coordinate to first function in array
    point = {
        x: xMouseToGraph(x),
        y: closest,
        // chooses first function if functions overlap, fix
        color: functions[outputs.indexOf(closest)].color
    };

    drawGraph(); // redraw graph to clear previous point

    drawPoint(); // draw new point
});

// when the window is resized, update width and height
window.addEventListener('resize', () => {
    graph.width = window.innerWidth - uiWidth - 1;
    graph.height = window.innerHeight - 1;

    width = graph.width;
    height = graph.height;

    // refresh graph
    setupGraph();
    drawGraph();
});

// set line width, then scale and translate graph so y goes upwards instead of down
function setupGraph() {
    ctx.lineWidth = 2; // set default line width

    ctx.scale(1,-1); // flip graph upside down so 0 is on the bottom
    ctx.translate(0, -height); // fix position
}

// draw the clicked point onto the screen
function drawPoint() {
    // round x and y to 2 decimal points
    const xRound = point.x.toFixed(2);
    const yRound = point.y.toFixed(2);

    const pointX = xGraphToCanvas(point.x);
    const pointY = yGraphToCanvas(-point.y);

    // draw the point on the screen
    ctx.beginPath();
    ctx.strokeStyle = point.color;
    ctx.fillStyle = point.color;
    ctx.arc(pointX, yGraphToCanvas(point.y), 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke()
    ctx.closePath();

    // flip graph back to the original configuration so that the
    // text is normal
    ctx.scale(1,-1);
    ctx.translate(0, -height);

    ctx.fillStyle = "black";
    ctx.fillText(`(${xRound}, ${yRound})`, pointX+5, pointY);
    
    ctx.scale(1,-1);
    ctx.translate(0, -height);
}

// draw the x and y axis
function drawAxes() {
    // position on the graph where x or y = 0
    const xZero = yGraphToCanvas(0);
    const yZero = xGraphToCanvas(0);

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
    for (let i = xrange[0]; i < xrange[1]; i++) {
        // only get x at whole numbers
        let x = xGraphToCanvas(Math.ceil(i));
        
        ctx.beginPath()
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.closePath();
    }

    // y lines
    for (let i = yrange[0]; i < yrange[1]; i++) {
        // only get y at whole numbers
        let y = yGraphToCanvas(Math.ceil(i));

        ctx.beginPath();
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

    for (let i = xrange[0]; i < xrange[1]; i += 0.01) {
        let x = xGraphToCanvas(i);
        let y = yGraphToCanvas(f(i));

        // fix vertical asymptotes
        if (y < 1_000_000 && y > -1_000_000)
            ctx.lineTo(x, y);
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
        let f = functions[key].func;
        let color = functions[key].color;

        drawFunction(f, color);
    }
}