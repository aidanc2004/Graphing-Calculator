/*
forms.js
Deals with getting input from forms and using the input
*/

// submiting equations
const equationForm = document.getElementById("equation-form");
const submitEquation = document.getElementById("submit-equation");
const equationInput = document.getElementById("equation");
const equationList = document.getElementById("equations");
const equationError = document.getElementById("equation-error");

// adjust x and y range
const xyForm = document.getElementById("x-y-form");
const xyUpdate = document.getElementById("x-y-update");
const xyError = document.getElementById("x-y-error");

// letter to use for function names (ex. f(x) = x^2 or g(x) = x^2)
const functionLetters = ['f', 'g', 'h', 'i', 'j', 'k'];

// make inputting an equation or new x/y value not refresh the page
equationForm.addEventListener("submit", (event) => event.preventDefault());
xyForm.addEventListener("submit", (event) => event.preventDefault());

// update the xmin, xmax, ymin, ymax values and refresh graph
function updateXY() {
    // get inputs from DOM
    let xminInput = document.getElementById("xmin");
    let xmaxInput = document.getElementById("xmax");
    let yminInput = document.getElementById("ymin");
    let ymaxInput = document.getElementById("ymax");

    // get value and cast to a number
    let xminValue = Number(xminInput.value);
    let xmaxValue = Number(xmaxInput.value);
    let yminValue = Number(yminInput.value);
    let ymaxValue = Number(ymaxInput.value);

    // if the input was empty, use default value
    if (xminInput.value == "") xminValue = -5;
    if (xmaxInput.value == "") xmaxValue = 5;
    if (yminInput.value == "") yminValue = -5;
    if (ymaxInput.value == "") ymaxValue = 5;

    // if min value isnt less than max value
    if (!(xminValue < xmaxValue)) {
        xyError.textContent = "Error: xmin must be less than xmax";
        return;
    }

    if (!(yminValue < ymaxValue)) {
        xyError.textContent = "Error: ymin must be less than ymax";
        return;
    }

    // clear any previous errors
    xyError.textContent = "";

    // set variables to new inputs
    xmin = xminValue;
    xmax = xmaxValue;
    ymin = yminValue;
    ymax = ymaxValue;

    // redraw graph to show new x and y range
    drawGraph();
}

// update x and y range when button is clicked
xyUpdate.addEventListener("click", updateXY);

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
    // if the is an undefined symbol, ex. b or c, this will catch it
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