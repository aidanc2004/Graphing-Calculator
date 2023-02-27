/*
    TODO:
    - allow user to remove functions
    - click to show point on function, ex. (1, 2)
    - add label for x and y axes
    - add css
*/

let graph = document.getElementById("graph");
let ctx = graph.getContext("2d");
let equationForm = document.getElementById("equation-form"); // rename
let xySettings = document.getElementById("x-y-settings");
let xyUpdate = document.getElementById("x-y-update");
let submitEquation = document.getElementById("submit");
let equationInput = document.getElementById("equation");
let equationList = document.getElementById("equations");

// object of color codes
let colorCodes = {
    "black": "#000000",
    "grey": "#dddddd",
    "red": "#ff0000",
    "green": "#00ad22",
    "blue": "#0000ff",
    "orange": "#ff8a00",
    "pink": "#ff60fe",
    "yellow": "#d9ec00",
}

let functions = [
    /*f = x => Math.pow(x, 2),
    g = x => (5 * Math.sin(x)),
    h = x => (x + 1) / (x - 1), // problems with horizontal asymptotes*/
];

let functionLetters = ['f', 'g', 'h', 'i', 'j', 'k'];

// make inputting an equation or new x/y value not refresh the page
equationForm.addEventListener("submit", (event) => event.preventDefault());
xySettings.addEventListener("submit", (event) => event.preventDefault());

// add button to get equation from user
submitEquation.addEventListener("click", () => {
    // get number of functions to determine what letter to use
    let numberOfFunctions = functions.length;

    let letter; // letter to use for the function name

    // if there are more functions then letters for the function, just use 'f'
    if (numberOfFunctions >= functionLetters.length) {
        letter = 'f';
    } else {
        letter = functionLetters[numberOfFunctions];
    }

    // get equation from user
    let equation = letter + "(x) = " + document.getElementById("equation").value;

    f = math.evaluate(equation) // evaluate equation into javascript function using Math.js
    functions.push(f);

    // redraw graph with new function
    drawGraph();

    // add equation to list of equations
    let li = document.createElement('li');
    li.innerText = equation;
    equationList.appendChild(li);
})

// width and height of the canvas
let width = graph.width;
let height = graph.height;

// range of x values
let xmin = -5;
let xmax = 5;
// range of y values
let ymin = -5;
let ymax = 5;

// update the xmin, xmax, ymin, ymax values and refresh graph
function updateXY() {
    // get inputs from DOM
    let xminInput = document.getElementById("xmin");
    let xmaxInput = document.getElementById("xmax");
    let yminInput = document.getElementById("ymin");
    let ymaxInput = document.getElementById("ymax");

    // set variables to new inputs
    xmin = Number(xminInput.value);
    xmax = Number(xmaxInput.value);
    ymin = Number(yminInput.value);
    ymax = Number(ymaxInput.value);

    // redraw graph to show new x and y range
    drawGraph();
}

// update x and y range when button is clicked
xyUpdate.addEventListener("click", () => {
    updateXY();
})

// draw the x and y axis
function drawAxes() {
    // position on the graph where x or y = 0
    let xZero = yScale(0);
    let yZero = xScale(0);

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
    let xZero = yScale(0);
    let yZero = xScale(0);

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

// scale x and y values to match width and height of canvas
function xScale(x) {
    return (x - xmin) * (width - 0) / (xmax - xmin);
}

function yScale(y) {
    return (y - ymin) * (height - 0) / (ymax - ymin);
}

// draw all functions on the graph and the axes
function drawGraph() {
    // clear canvas
    ctx.clearRect(0, 0, width, height);

    drawGrid();

    // draw x and y axis
    drawAxes();

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

let colors = [colorCodes["red"], colorCodes["green"], colorCodes["blue"], colorCodes["orange"], colorCodes["pink"], colorCodes["yellow"]];

ctx.lineWidth = 2;

ctx.scale(1,-1); // flip graph upside down so 0 is on the bottom
ctx.translate(0, -height); // fix position

// draw first graph with no functions
drawGraph();