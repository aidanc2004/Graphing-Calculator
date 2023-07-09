/*
 * forms.js
 * Handles getting input from forms and using the input
 */

// submiting equations
const equationForm = document.getElementById("equation-form");
const submitEquation = document.getElementById("submit-equation");
const equationInput = document.getElementById("equation");
const equationList = document.getElementById("equations-list");
const equationError = document.getElementById("equation-error");

// adjust x and y range
const xyForm = document.getElementById("x-y-form");
const xyUpdate = document.getElementById("x-y-update");
const xyError = document.getElementById("x-y-error");

// help menu
const helpButton = document.getElementById("help");
const helpMenu = document.getElementById("help-menu");
const helpLoadEquations = document.getElementById("help-load");
const closeHelp = document.getElementById("closeHelp");

// letter to use for function names (ex. f(x) = x^2 or g(x) = x^2)
// excludes 'x', because its used for the functions variable
const functionLetters = "qwertyuiopasdfghjklzcvbnm".split('').sort();

// make inputting an equation or new x/y value not refresh the page
equationForm.addEventListener("submit", (event) => event.preventDefault());
xyForm.addEventListener("submit", (event) => event.preventDefault());

/*
 * X/Y Range
 */

// update the xmin, xmax, ymin, ymax values and refresh graph when button is clicked
xyUpdate.addEventListener("click", () => {
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
    xrange = [xminValue, xmaxValue];
    yrange = [yminValue, ymaxValue];

    //[xmin, xmax, ymin, ymax] = [xminValue, xmaxValue, yminValue, ymaxValue];

    // redraw graph to show new x and y range
    drawGraph();
});

/*
 * Equations
 */

// add button to get equation from user
submitEquation.addEventListener("click", () => {
    const value = document.getElementById("equation").value;
    addFunction(value);
});

// add an equation from input or argument
function addFunction(value) {
    // if there are more functions than names, dont add equation
    if (functions.length >= functionLetters.length) return;

    // get first letter that isnt already a function name
    let letter = chooseFunctionLetter();

    // get equation from user
    let equation = letter + "(x) = " + value;

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

    // choose color
    let color = chooseFunctionColor();

    // test, fix color
    functions.push(
        createFunction(equation, f, letter, color));

    // redraw graph with new function
    drawGraph();

    // add to list of equations
    equationList.appendChild(
        createListItem(equation));
}

/*
 * Help Menu
 */

// show and hide help menu
helpButton.addEventListener("click", () => {
    const display = helpMenu.style.display;

    if (display === "block") {
        helpMenu.style.display = "none";
    } else {
        helpMenu.style.display = "block";
    }
});

// close help menu
closeHelp.addEventListener("click", () => {
    helpMenu.style.display = "none";
})

// load example equations into graph
helpLoadEquations.addEventListener("click", () => {
    addFunction("x^2 + 2x + 1");
    addFunction("3sin(1.5x)");
    addFunction("(x+1)/(x-1)");
});

// close help menu with you click away
document.addEventListener("click", (event) => {
    const display = helpMenu.style.display;

    if (display === "block" &&              // if menu is open
        !helpMenu.contains(event.target) && // dont close if clicking help menu
        event.target !== helpButton) {      // dont close if clicking help button
        
        helpMenu.style.display = "none";
    }
})

/*
 * Helper functions
 */

// create the list item for an equation
function createListItem(equation) {
    // create li
    let li = document.createElement('li');
    li.innerText = equation;

    // button to delete equation
    let del = document.createElement('button'); 
    del.innerText = "x";
    del.addEventListener("click", deleteFunction);
    del.className = "delete";
    
    li.prepend(del)

    return li;
}

// delete a function from the array of functions and the list of functions
function deleteFunction() {
    let equation = this.parentNode.innerText;
    // name of the function, only first letter, ignore first character
    // because its the 'x' of the delete button
    let letter = equation[1]; 

    functions.forEach(f => {
        // if the function names are the same, remove it
        if (f.name == letter) {
            functions = functions.filter(a => a != f); // remove function
            equationList.removeChild(this.parentNode); // remove li
            drawGraph(); // redraw graph to show change
        }
    });
}

// get a letter to use for a function name that isnt already being used
function chooseFunctionLetter() {
    // get all currently used function names
    let functionNames = [];
    functions.forEach(f => {
        functionNames.push(f.name);
    });

    // choose a letter and return it
    for (let i = 0; i < functionLetters.length; i++) {
        if (!functionNames.includes(functionLetters[i])) {
            return functionLetters[i];
        }
    }
}

// get a letter to use for a function name that isnt already being used
function chooseFunctionColor() {
    // get all currently used function names
    let functionColors = [];
    functions.forEach(f => {
        functionColors.push(f.color);
    });

    // choose a color
    for (let i = 0; i < colors.length; i++) {
        if (!functionColors.includes(colors[i])) {
            return colors[i];
        }
    }

    // if out of useable colors, use black
    return "black";
}