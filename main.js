/*
 * main.js
 * Program starting point
 */

/*
 * TODO:
 * - Better mobile support
 *   - Put graph at top and equations at the bottom
 * - Esc to quit help menu
 * - Scroll in and out of graph with scroll wheel
 *   - Drag with middle click to adjust?
 */

(() => {
    setupGraph(); // set up graph for adding functions
    drawGraph();  // draw first graph with no functions
})();