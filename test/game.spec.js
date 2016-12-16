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

    describe('the getCellAt function', () => {
        it('should be a function', () => {
            expect(game.getCellAt).to.be.a('function');
        });

        it('returns 0 if any of the arguments are bad or missing', () => {
            expect(game.getCellAt()).to.equal(0);
            expect(game.getCellAt(null)).to.equal(0);
            expect(game.getCellAt(123)).to.equal(0);
            expect(game.getCellAt('foo')).to.equal(0);
            expect(game.getCellAt({})).to.equal(0);
            expect(game.getCellAt([])).to.equal(0);
            expect(game.getCellAt([], 0)).to.equal(0);
            expect(game.getCellAt([], 0, 0)).to.equal(0);
        });

        it('returns the value at the 2D array index if valid', () => {
            const legitArray = [[1]];
            expect(game.getCellAt(legitArray, 0, 0)).to.equal(1);
        });

        it('returns the value at the 2D array index if valid', () => {
            const legitArray = [
                [0, 1],
                [1, 0]
            ];
            expect(game.getCellAt(legitArray, 0, 1)).to.equal(1);
            expect(game.getCellAt(legitArray, 1, 0)).to.equal(1);
        });

        it('returns 0 for coordinates outside the bounds of the array', () => {
            const legitArray = [
                [1, 1],
                [1, 1]
            ];
            expect(game.getCellAt(legitArray, -1, -1)).to.equal(0);
            expect(game.getCellAt(legitArray, -1, 0)).to.equal(0);
            expect(game.getCellAt(legitArray, -1, 1)).to.equal(0);
            expect(game.getCellAt(legitArray, -1, 2)).to.equal(0);
            expect(game.getCellAt(legitArray, 0, -1)).to.equal(0);
            expect(game.getCellAt(legitArray, 0, 2)).to.equal(0);
            expect(game.getCellAt(legitArray, 1, -1)).to.equal(0);
            expect(game.getCellAt(legitArray, 1, 2)).to.equal(0);
            expect(game.getCellAt(legitArray, 2, -1)).to.equal(0);
            expect(game.getCellAt(legitArray, 2, 0)).to.equal(0);
            expect(game.getCellAt(legitArray, 2, 1)).to.equal(0);
            expect(game.getCellAt(legitArray, 2, 2)).to.equal(0);
        });
    });

    describe('a game turn (tick)', () => {
        it('should have a tick function', () => {
            expect(game.tick).to.be.a('function');
        });

        it('should return an empty array for bad arguments', () => {
            expect(game.tick()).to.deep.equal([]);
            expect(game.tick(null)).to.deep.equal([]);
            expect(game.tick('foo')).to.deep.equal([]);
            expect(game.tick(123)).to.deep.equal([]);
            expect(game.tick([])).to.deep.equal([]);
            expect(game.tick({})).to.deep.equal([]);
        });

        it('should return a new game state (not mutate the one passed in)', () => {
            const initialGameState = [];
            const newGameState = game.tick(initialGameState);
            expect(newGameState).to.be.an('array');
            expect(newGameState).not.to.equal(initialGameState);
        });

        it('should assume zeros at the edges and corners', () => {
            // 0 0 0
            // 0 1 0
            // 0 0 0
            const initialGameState = [[1]];
            const newGameState = game.tick(initialGameState);
            expect(newGameState).to.deep.equal([[0]]);
        });

        it('should handle the block still life pattern', () => {
            const blockPattern = [
                [1, 1],
                [1, 1]
            ];
            const newGameState = game.tick(blockPattern);
            expect(newGameState).to.not.equal(blockPattern);
            expect(newGameState).to.deep.equal(blockPattern);
        });

        it('should handle the beehive still life pattern', () => {
            const beehivePattern = [
                [0, 1, 1, 0],
                [1, 0, 0, 1],
                [0, 1, 1, 0]
            ];
            const newGameState = game.tick(beehivePattern);
            expect(newGameState).to.deep.equal(beehivePattern);
        });

        it('should handle the loaf still life pattern', () => {
            const loafPattern = [
                [0, 1, 1, 0],
                [1, 0, 0, 1],
                [0, 1, 0, 1],
                [0, 0, 1, 0]
            ];
            const newGameState = game.tick(loafPattern);
            expect(newGameState).to.deep.equal(loafPattern);
        });

        it('should handle the boat still life pattern', () => {
            const boatPattern = [
                [1, 1, 0],
                [1, 0, 1],
                [0, 1, 0]
            ];
            const newGameState = game.tick(boatPattern);
            expect(newGameState).to.deep.equal(boatPattern);
        });

        it('should handle the blinker oscillator pattern', () => {
            const blinkPattern1 = [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ];
            const blinkPattern2 = [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ];
            let newGameState = game.tick(blinkPattern1);
            expect(newGameState).to.deep.equal(blinkPattern2);
            newGameState = game.tick(newGameState);
            expect(newGameState).to.deep.equal(blinkPattern1);
        });

        it('should handle the toad oscillator pattern', () => {
            const toadPattern1 = [
                [0, 0, 0, 0],
                [0, 1, 1, 1],
                [1, 1, 1, 0],
                [0, 0, 0, 0]
            ];
            const toadPattern2 = [
                [0, 0, 1, 0],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [0, 1, 0, 0]
            ];
            let newGameState = game.tick(toadPattern1);
            expect(newGameState).to.deep.equal(toadPattern2);
            newGameState = game.tick(newGameState);
            expect(newGameState).to.deep.equal(toadPattern1);
        });

        it('should handle the beacon oscillator pattern', () => {
            const beaconPattern1 = [
                [1, 1, 0, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 1],
                [0, 0, 1, 1]
            ];
            const beaconPattern2 = [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 1, 1],
                [0, 0, 1, 1]
            ];
            let newGameState = game.tick(beaconPattern1);
            expect(newGameState).to.deep.equal(beaconPattern2);
            newGameState = game.tick(newGameState);
            expect(newGameState).to.deep.equal(beaconPattern1);
        });

        it('should handle the glider pattern', () => {
            const gliderPattern1 = [
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0]
            ];
            const gliderPattern2 = [
                [0, 0, 0, 0],
                [1, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0]
            ];
            const gliderPattern3 = [
                [0, 0, 0, 0],
                [0, 0, 1, 0],
                [1, 0, 1, 0],
                [0, 1, 1, 0]
            ];
            const gliderPattern4 = [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 1],
                [0, 1, 1, 0]
            ];
            const gliderPattern5 = [
                [0, 0, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1],
                [0, 1, 1, 1]
            ];

            const state2 = game.tick(gliderPattern1);
            const state3 = game.tick(state2);
            const state4 = game.tick(state3);
            const state5 = game.tick(state4);

            expect(state2, 'tick1').to.deep.equal(gliderPattern2);
            expect(state3, 'tick2').to.deep.equal(gliderPattern3);
            expect(state4, 'tick3').to.deep.equal(gliderPattern4);
            expect(state5, 'tick4').to.deep.equal(gliderPattern5);
        });
    });
});
