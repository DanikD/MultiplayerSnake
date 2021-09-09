const randomFood = require('./randomfood')
const createGameState = require('./gamestate')

function initGame() {
    const state = createGameState()
    state.food = randomFood(state.players)
    return state
}

module.exports = initGame