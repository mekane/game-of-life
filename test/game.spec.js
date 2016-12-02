const expect = require('chai').expect;
const game = require('../src/game');

describe('the Game of Life rules', () => {
    it('should be a module', () => {
        expect(game).to.be.an('object');
    });

    describe('getting a new game state', () => {
        it('should have a newGame function', () => {
            expect(game.newGame).to.be.a('function');
        });

        it('should return the game state for an empty game', () => {
            const expectedGameState = [];
            expect(game.newGame()).to.deep.equal(expectedGameState);
        });

        it('should return the game state for a new game with a specified size', () => {
            const expectedGameState = [
                [0, 0],
                [0, 0]
            ];
            expect(game.newGame(2)).to.deep.equal(expectedGameState);
        });

        it('should return the game state for a new game with a specified size', () => {
            const expectedGameState = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];
            expect(game.newGame(3)).to.deep.equal(expectedGameState);
        });
    });

    describe('getting the next state for a group of cells', () => {
        it('should have a nextState function', () => {
            expect(game.nextState).to.be.a('function');
        });

        it("expects a 3x3 array, and throws an exception if it doesn't get one", () => {
            const badArgsUndefined = () => {
                return game.nextState();
            };
            const badArgsNull = () => {
                return game.nextState(null);
            };
            const badArgsString = () => {
                return game.nextState("foo");
            };
            const badArgsNumber = () => {
                return game.nextState(123);
            };
            const badArgsShortArray1 = () => {
                return game.nextState([]);
            };
            const badArgsShortArray2 = () => {
                return game.nextState([[], [], []]);
            };
            const badArgsShortArray3 = () => {
                return game.nextState([[0, 0, 0], [0, 0, 0], []]);
            };
            expect(badArgsUndefined).to.throw();
            expect(badArgsNull).to.throw();
            expect(badArgsString).to.throw();
            expect(badArgsNumber).to.throw();
            expect(badArgsShortArray1).to.throw();
            expect(badArgsShortArray2).to.throw();
            expect(badArgsShortArray3).to.throw();

            const goodState = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
            expect(game.nextState(goodState)).to.be.a('number');
        });

        it('A live cell dies if it has fewer than two live neighbors (underpopulation)', () => {
            const underpopulatedZero = [
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]
            ];
            const underpopulatedOneAbove = [
                [0, 1, 0],
                [0, 1, 0],
                [0, 0, 0]
            ];
            const underpopulatedOneBelow = [
                [0, 0, 0],
                [0, 1, 0],
                [0, 1, 0]
            ];
            const underpopulatedOneRight = [
                [0, 0, 0],
                [0, 1, 1],
                [0, 0, 0]
            ];
            const underpopulatedOneDiagonal = [
                [0, 0, 1],
                [0, 1, 0],
                [0, 0, 0]
            ];
            expect(game.nextState(underpopulatedZero)).to.equal(0);
            expect(game.nextState(underpopulatedOneAbove)).to.equal(0);
            expect(game.nextState(underpopulatedOneBelow)).to.equal(0);
            expect(game.nextState(underpopulatedOneRight)).to.equal(0);
            expect(game.nextState(underpopulatedOneDiagonal)).to.equal(0);
        });

        it('A live cell dies if it has more than three live neighbors (overpopulation)', () => {
            const overpopulationFour = [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 1]
            ];
            const overpopulationFive = [
                [1, 0, 1],
                [0, 1, 0],
                [1, 1, 1]
            ];
            const overpopulationSix = [
                [1, 0, 1],
                [1, 1, 1],
                [1, 0, 1]
            ];
            const overpopulationSeven = [
                [1, 1, 1],
                [1, 1, 1],
                [1, 0, 1]
            ];
            const overpopulationEight = [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1]
            ];
            expect(game.nextState(overpopulationFour)).to.equal(0);
            expect(game.nextState(overpopulationFive)).to.equal(0);
            expect(game.nextState(overpopulationSix)).to.equal(0);
            expect(game.nextState(overpopulationSeven)).to.equal(0);
            expect(game.nextState(overpopulationEight)).to.equal(0);
        });

        it('A live cell lives if it has exactly two or three live neighbors', () => {
            const liveOnTwoHorizontal = [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ];
            const liveOnTwoVertical = [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ];
            const liveOnTwoDiagonal = [
                [0, 0, 1],
                [0, 1, 0],
                [1, 0, 0]
            ];
            const liveOnThreeHorizontal = [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ];
            const liveOnThreeVertical = [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0]
            ];
            const liveOnThreeDiagonal = [
                [0, 1, 1],
                [0, 1, 0],
                [1, 0, 0]
            ];
            expect(game.nextState(liveOnTwoHorizontal)).to.equal(1);
            expect(game.nextState(liveOnTwoVertical)).to.equal(1);
            expect(game.nextState(liveOnTwoDiagonal)).to.equal(1);
            expect(game.nextState(liveOnThreeHorizontal)).to.equal(1);
            expect(game.nextState(liveOnThreeVertical)).to.equal(1);
            expect(game.nextState(liveOnThreeDiagonal)).to.equal(1);
        });

        it('A dead cell with exactly three living neighbors comes alive (reproduction)', () => {
            const initialStateOne = [
                [1, 0, 1],
                [0, 0, 0],
                [0, 1, 0]
            ];
            const initialStateTwo = [
                [0, 0, 1],
                [0, 0, 1],
                [0, 0, 1]
            ];
            const initialStateThree = [
                [0, 1, 0],
                [1, 0, 1],
                [0, 0, 0]
            ];
            expect(game.nextState(initialStateOne)).to.equal(1);
            expect(game.nextState(initialStateTwo)).to.equal(1);
            expect(game.nextState(initialStateThree)).to.equal(1);
        });

    });


    describe('a game turn (tick)', () => {
        it('should have a tick function', () => {
            expect(game.tick).to.be.a('function');
        });

        it('should return a new game state (not mutate the one passed in)', () => {
            const initialGameState = [];
            const newGameState = game.tick(initialGameState);
            expect(newGameState).to.be.an('array');
            expect(newGameState).not.to.equal(initialGameState);
        });

        //more game state tests
    });
});
