/*
    TODO:
    - allow user to remove functions
    - click to show point on function, ex. (1, 2)
    - add label for x and y axes
    - add css
    - fix vertical asymptotes
*/

// canvas and context
const graph = document.getElementById("graph");
const ctx = graph.getContext("2d");
// submiting equations
const equationForm = document.getElementById("equation-form");
const submitEquation = document.getElementById("submit-equation");
const equationInput = document.getElementById("equation");
const equationList = document.getElementById("equations");
// adjust x and y range
const xyForm = document.getElementById("x-y-form");
const xyUpdate = document.getElementById("x-y-update");

const equationError = document.getElementById("error");

// width and height of the canvas
const width = graph.width;
const height = graph.height;

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

// letter to use for function names (ex. f(x) = x^2 or g(x) = x^2)
const functionLetters = ['f', 'g', 'h', 'i', 'j', 'k'];

// range of x values
let xmin = -5;
let xmax = 5;
// range of y values
let ymin = -5;
let ymax = 5;

// array of all functions of graph
let functions = [];

// make inputting an equation or new x/y value not refresh the page
equationForm.addEventListener("submit", (event) => event.preventDefault());
xyForm.addEventListener("submit", (event) => event.preventDefault());

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

    // catch errors with evaluating equation
    try {
        f = math.evaluate(equation) // evaluate equation into javascript function using Math.js
        equationError.textContent = "";
    } catch (error) {
        equationError.textContent = error.toString();
        return;
    }

    // catch errors with passing a value to the equation
    try {
        f(1); // using x = 1 as an example
    } catch (error) {
        equationError.textContent = error.toString();
        return;
    }
    
    functions.push(f);

    // redraw graph with new function
    drawGraph();

    // add equation to list of equations
    let li = document.createElement('li');
    li.innerText = equation;
    equationList.appendChild(li);
})

// update the xmin, xmax, ymin, ymax values and refresh graph
function updateXY() {
    // get inputs from DOM
    let xminInput = document.getElementById("xmin");
    let xmaxInput = document.getElementById("xmax");
    let yminInput = document.getElementById("ymin");
    let ymaxInput = document.getElementById("ymax");

    // set variables to new inputs or defaults
    xmin = Number(xminInput.value) || -5;
    xmax = Number(xmaxInput.value) || 5;
    ymin = Number(yminInput.value) || -5;
    ymax = Number(ymaxInput.value) || 5;

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

        // catch errors with drawing function
        //try {
            drawFunction(f, color);
        //} catch (error) {
        //    equationError.textContent = "ERROR";
        //}
    }
}

// main function
(() => {
    ctx.lineWidth = 2;

    ctx.scale(1,-1); // flip graph upside down so 0 is on the bottom
    ctx.translate(0, -height); // fix position

    // draw first graph with no functions
    drawGraph();
})();