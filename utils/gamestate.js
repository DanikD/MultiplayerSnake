const { GRID_SIZE } = require('./consts')

function createGameState() {
    return {
        players: [{
            pos: {
                x: 5,
                y: 3
            },
            vel: {
                x: 1,
                y: 0
            },
            snake: [
                {x: 3, y: 3},
                {x: 4, y: 3},
                {x: 5, y: 3}
            ],
            // active: true,
        }, 
        {
            pos: {
                x: 5,
                y: 4
            },
            vel: {
                x: 1,
                y: 0 
            },
            snake: [
                {x: 3, y: 4},
                {x: 4, y: 4},
                {x: 5, y: 4}
            ],
            // active: true,
        }],
        food: {
            x: 0,
            y: 0
        },
        gridsize: GRID_SIZE,
    }
}

module.exports = createGameState