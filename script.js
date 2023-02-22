/*
    TODO:
    - allow user to adjust xmin, xmax, ymin and ymax
    - allow user to remove functions
    - click to show point on function, ex. (1, 2)
    - add label for x and y axes
    - add css
*/

let graph = document.getElementById("graph");
let ctx = graph.getContext("2d");
let form = document.getElementById("form");
let submitEquation = document.getElementById("submit");
let equationInput = document.getElementById("equation");
let equationList = document.getElementById("equations");

let functions = [
    /*f = x => Math.pow(x, 2),
    g = x => (5 * Math.sin(x)),
    h = x => (x + 1) / (x - 1), // problems with horizontal asymptotes*/
];

let functionLetters = ['f', 'g', 'h'];

// make inputting an equation not refresh the page
form.addEventListener("submit", (event) => event.preventDefault());

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

    console.log("letter", letter)

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

// draw the x and y axis
function drawAxes() {
    // position on the graph where x or y = 0
    let xZero = yScale(0);
    let yZero = xScale(0);

    ctx.strokeStyle = "#000000";

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
    ctx.strokeStyle = '#dddddd';

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

    ctx.strokeStyle = '#000000';
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
            color = "#000000";
        }

        drawFunction(f, color);
    }
}

let colors = ["#ff0000", "#00ad22", "#0000ff"];

ctx.lineWidth = 2;

ctx.scale(1,-1); // flip graph upside down so 0 is on the bottom
ctx.translate(0, -height); // fix position

drawGraph();