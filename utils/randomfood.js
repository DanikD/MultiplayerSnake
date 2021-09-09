const { GRID_SIZE } = require('./consts')

function randomFood(players) {
    const food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    }
    
    // players.forEach((player) => { 
    //     player.snake.forEach(cell => {
    //         if (cell.x == food.x && cell.y == food.y) {
    //             randomFood(player)
    //         }
    //     })
    // })
    return food
}

module.exports = randomFood