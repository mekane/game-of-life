module.exports = {
    getCellAt: getCellAt,
    newGame: newGame,
    nextState: nextState,
    tick: tick
};

function getCellAt(board, x, y) {
    const validArray = board && Array.isArray(board) && board.length;
    const validCoord = x >= 0 && y >= 0 && x < board.length;
    if (validArray && validCoord) {
        const row = board[x];
        if (row && Array.isArray(row) && y < row.length)
            return row[y];
    }
    return 0;
}

function newGame(size) { //assuming square
    let board = [];

    for (let i = 0; i < size; i++) {
        board.push(new Array(size).fill(0));
    }

    return board;
}

function nextState(board) {
    if (!board || !Array.isArray(board))
        throw new Error('bad board state');

    if (board.length < 3)
        throw new Error('bad board state - not 3x3 array');

    for (let i = 0; i < 3; i++)
        if (!Array.isArray(board[i]) || board[i].length < 3)
            throw new Error('bad board state - not 3x3 array');

    const thisCellIsLiving = !!board[1][1];

    const topRowLivingCount = !!board[0][0] + !!board[0][1] + !!board[0][2];
    const midRowLivingCount = !!board[1][0] + !!board[1][2];
    const botRowLivingCount = !!board[2][0] + !!board[2][1] + !!board[2][2];

    const totalLivingNeighbors = topRowLivingCount + midRowLivingCount + botRowLivingCount;
    const populationIsOk = (totalLivingNeighbors === 2 || totalLivingNeighbors === 3);

    if (thisCellIsLiving && populationIsOk)
        return 1;

    if (!thisCellIsLiving && totalLivingNeighbors === 3)
        return 1;

    return 0;
}

function tick(board) {
    if (!board || !Array.isArray(board) || board.length === 0)
        return [];

    let nextBoard = newGame(board.length); //assuming square

    for (let x = 0; x < board.length; x++) {
        const row = board[x];
        for (let y = 0; y < row.length; y++) {
            const neighborhood = [
                [c(x - 1, y - 1), c(x - 0, y - 1), c(x + 1, y - 1)],
                [c(x - 1, y - 0), c(x - 0, y - 0), c(x + 1, y + 0)],
                [c(x - 1, y + 1), c(x - 0, y + 1), c(x + 1, y + 1)]
            ];
            nextBoard[x][y] = nextState(neighborhood);
        }
    }

    return nextBoard;

    function c(x, y) {
        return getCellAt(board, x, y);
    }
}