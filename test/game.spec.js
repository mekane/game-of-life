const expect = require('chai').expect;
const game = require('../src/game');

describe('the Game of Life rules', () => {
    it('should be a module', () => {
        expect(game).to.be.an('object');
    });
});
