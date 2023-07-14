/*
 * drawing.js
 * Handles drawing to the graph
 */

// canvas and context
const graph = document.getElementById("graph");
const ctx = graph.getContext("2d");

// ui and width of ui (when screen is >520px)
const ui = document.getElementById("ui");
// const help = document.getElementById("help");
const uiWidth = ui.clientWidth;

let width = graph.width;
let height = graph.height;

// set inital width and height
updateSize();

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
    "purple": "#800080",
    "lime": "#00ff00",
    "turquoise": "#40e0d0",
    "magenta": "#ff00ff",
    "teal": "#008080",
    "indigo": "#4b0082",
    "aqua": "#00ffff",
    "violet": "#ee82ee",
    "gold": "#ffd700",
    "coral": "#ff7f50",
    "cyan": "#00ffff",
    "olive": "#808000",
    "navy": "#000080",
    "lavender": "#e6e6fa",
    "maroon": "#800000",
    "darkgreen": "#006400",
    "steelblue": "#4682b4",
    "sienna": "#a0522d",
    "peachpuff": "#ffdab9"
};

// array of colors to use for functions
const colors = [
    colorCodes["red"],
    colorCodes["lime"],
    colorCodes["blue"],
    colorCodes["orange"],
    colorCodes["pink"],
    colorCodes["gold"],
    colorCodes["green"],
    colorCodes["turquoise"],
    colorCodes["purple"],
    colorCodes["yellow"],
    colorCodes["magenta"],
    colorCodes["teal"],
    colorCodes["indigo"],
    colorCodes["aqua"],
    colorCodes["violet"],
    colorCodes["coral"],
    colorCodes["cyan"],
    colorCodes["olive"],
    colorCodes["navy"],
    colorCodes["lavender"],
    colorCodes["maroon"],
    colorCodes["darkgreen"],
    colorCodes["steelblue"],
    colorCodes["sienna"],
    colorCodes["peachpuff"]
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
    const x = (graph.width < 520) ?  e.clientX : e.clientX - uiWidth;
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
    updateSize();

    // refresh graph
    setupGraph();
    drawGraph();
});

// update size of graph and move ui
function updateSize() {
    if (window.innerWidth < 520) {
        graph.width = window.innerWidth;
        graph.height = window.innerWidth;

        ui.style.top = graph.height.toString() + "px";
        helpButton.style.left = (window.innerWidth - 30).toString() + "px";
    } else {
        graph.width = window.innerWidth - uiWidth - 1;
        graph.height = window.innerHeight - 1;
        helpButton.style.left = "1rem";
        helpButton.style.bottom = "1rem";
    }

    width = graph.width;
    height = graph.height;
}

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
    // outline
    ctx.beginPath();
    ctx.strokeStyle = colorCodes["black"];
    ctx.fillStyle = colorCodes["black"];
    ctx.arc(pointX, yGraphToCanvas(point.y), 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    // point
    ctx.beginPath();
    ctx.strokeStyle = point.color;
    ctx.fillStyle = point.color;
    ctx.arc(pointX, yGraphToCanvas(point.y), 1.8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // flip graph back to the original configuration so that the
    // text is normal
    ctx.scale(1,-1);
    ctx.translate(0, -height);

    ctx.font = "0.80rem Trebuchet MS";
    ctx.fillStyle = "black";
    ctx.fillText(`(${xRound}, ${yRound})`, pointX+5, -yGraphToCanvas(point.y) + height - 5);

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

/* Mouse graph movement */

// if user is dragging the mouse
let drag = false;
// last mouse position while dragging
let dragX = 0;
let dragY = 0;

// find out when user is dragging on graph
graph.addEventListener("mousedown", event => {
    drag = true;
    // set inital mouse position
    dragX = event.clientX;
    dragY = event.clientY;
});

graph.addEventListener("mouseup", () => {
    drag = false;
});

// change x/y range based on user dragging graph
graph.addEventListener("mousemove", event => {
    // if the user isnt dragging on the graph, dont do anything
    if (!drag) return;

    // get current mouse position
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    // use scale so it moves farther when zoomed out
    const scaleX = (Math.abs(xrange[0]) + Math.abs(xrange[1])) / 10;
    const scaleY = (Math.abs(yrange[0]) + Math.abs(yrange[1])) / 10;

    // calculate what to change x/y range by
    const changeX = (dragX - mouseX) / 150 * scaleX;
    const changeY = (dragY - mouseY) / 150 * scaleY;

    // update x/y range
    xrange[0] += changeX;
    xrange[1] += changeX;
    yrange[0] -= changeY;
    yrange[1] -= changeY;

    // replace last mouse position
    dragX = mouseX;
    dragY = mouseY;

    // draw graph to show update
    drawGraph();

    drawPoint();
})

// zoom in and out of graph
graph.addEventListener("wheel", event => {
    // get amount scrolled on wheel
    const scroll = event.deltaY;

    // use scale so it zooms in/out faster based on range
    const scale = (Math.abs(xrange[0]) + Math.abs(xrange[1])) / 10

    // calculate what to change x/y range by to zoom in/out
    const change = scroll / 150 * scale;

    // update x/y range to zoom in/out
    xrange[0] += change;
    xrange[1] -= change;
    yrange[0] += change;
    yrange[1] -= change;

    // draw graph to show update
    drawGraph();
})