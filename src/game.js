module.exports = {
    newGame: newGame,
    nextState: nextState,
    tick: tick
};

function newGame(size) {
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

    if ( thisCellIsLiving && populationIsOk )
        return 1;

    if ( !thisCellIsLiving && totalLivingNeighbors === 3)
        return 1;

    return 0;
}

function tick(board) {
    return [];
}