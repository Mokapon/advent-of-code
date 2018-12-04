function initGrid(cols, rows, fillFunction) {
    let grid = [];
    for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
            grid[i][j] = fillFunction ? fillFunction(i, j) : 0;
        }
    }
    return grid;
}

function compareValues(a, b) {
    return a - b;
}