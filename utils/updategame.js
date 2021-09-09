const randomFood = require("./randomfood")
const { GRID_SIZE } = require("./consts")
function updateGameState(gameState) {
    let winner = -1
    let wins = []
    let newGameState = gameState
    const food = newGameState.food
    newGameState.players.forEach((player, id) => {
        const enemyId = 1-id

        player.pos.x += player.vel.x
        player.pos.y += player.vel.y

        if (player.pos.x < 0 || player.pos.x > GRID_SIZE || player.pos.y < 0 || player.pos.y > GRID_SIZE) {
            wins.push(enemyId)
        }

        if (player.pos.x == food.x && player.pos.y == food.y) {
            player.snake.push({...player.pos})
            player.pos.x += player.vel.x
            player.pos.y += player.vel.y
            newGameState.food = randomFood(newGameState.players)
        }

        if (player.vel.x || player.vel.y) {
            for (let cell of player.snake) {
                if (cell.x === player.pos.x && cell.y === player.pos.y) {
                    wins.push(enemyId)
                }
            }

            const enemy = gameState.players[enemyId]
            for (let cell of enemy.snake) {
                if (cell.x === player.pos.x && cell.y === player.pos.y) {
                    wins.push(enemyId)
                }
            }

            player.snake.push({...player.pos})
            player.snake.shift()
        }
    })
    if (wins.length === 1) {
        winner = wins[0]
    } else if (wins.length > 1) {
        winner = -2
    }
    return {newGameState, winner}
}

module.exports = updateGameState