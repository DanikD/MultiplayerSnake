const BG_COLOUR = '#231f20';
const PLAYER_COLOUR = '#c2c2c2';
const ENEMY_COLOUR = 'red'
const FOOD_COLOUR = '#e66916';

const socket = io()

const gameScreen = document.getElementById('gameScreen')
const initialScreen = document.getElementById('initialScreen')
const newGameBtn = document.getElementById('newGameButton')
const joinGameBtn = document.getElementById('joinGameButton')
const gameCodeInput = document.getElementById('gameCodeInput')
const gameCodeDisplay = document.getElementById('gameCodeDisplay')

newGameBtn.addEventListener('click', newGame)
joinGameBtn.addEventListener('click', joinGame)

function newGame() {
    socket.emit('newGame')
    init()
}

function joinGame() {
    const code = gameCodeInput.value
    gameCode = code
    socket.emit('joinGame', code)
    init()
}

let canvas, ctx
let playerNumber
let gameActive = false
let gameCode = ''

const width = 550
const height = 550

socket.on('gamestate', handleGameState)
socket.on('gamecode', handleGameCode)
socket.on('gameover', handleGameOver)
socket.on('init', handleInit)
socket.on('unknownGame', handleUnknownGame)
socket.on('tooManyPlayers', handleTooManyPlayers)
socket.on('enemydisconnect', handleEnemyDisconnect)

function init() {
    initialScreen.style.display = 'none'
    gameScreen.style.display = 'block'

    canvas = document.querySelector('canvas')
    ctx = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = BG_COLOUR
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = PLAYER_COLOUR
    ctx.textAlign = 'center'
    ctx.font = "35px Arial"
    ctx.fillText('Waiting for another player...', width / 2, height / 2.5)

    document.addEventListener('keydown', keydown)

    gameActive = true
}

function paintGame(gameState, playerId) {
    const tileSize = width / gameState.gridsize

    ctx.fillStyle = BG_COLOUR
    ctx.fillRect(0, 0, width, height)

    const food = gameState.food
    ctx.fillStyle = FOOD_COLOUR
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize)

    const players = gameState.players
    players.forEach((player, id) => {
        if (id === playerId) {
            ctx.fillStyle = PLAYER_COLOUR
        } else {
            ctx.fillStyle = ENEMY_COLOUR
        }
        player.snake.forEach(cell => { 
            ctx.fillRect(cell.x * tileSize, cell.y * tileSize, tileSize, tileSize)
        })
    })
}

function keydown(e) {
    socket.emit('keydown', e.keyCode)   
}

function handleInit(playerId) {
    playerNumber = playerId
}

function handleGameCode(code) {
    gameCodeDisplay.innerText = code
    gameCode = code
}

function handleGameState(gameState) { 
    requestAnimationFrame(() => paintGame(gameState, playerNumber)) 
}

function handleGameOver(winner) { 
    if (!gameActive) {
        return
    }

    if (winner === -2) {
        alert("It's draw!!!")
    } else {
        if (playerNumber === winner) { 
            alert('You win!!!') 
        } else { 
            alert('You lose :(') 
        }
    }

    gameActive = false 
}

function handleUnknownGame() {
    reset()
    alert('Unknown game code')
}

function handleTooManyPlayers() {
    reset()
    alert('This game in already in progress')
}

function handleEnemyDisconnect(code) {
    if (gameActive && gameCode === code) {
        reset()
        alert('Your opponent has been disconnected')
    }
}

function reset() {
    playerNumber = null
    gameCodeInput.value = ""
    gameCodeDisplay.innerText = ""
    initialScreen.style.display = "block"
    gameScreen.style.display = "none"
}