const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const updateGameState = require('./utils/updategame')
const makeid = require('./utils/makeid')
const initGame = require('./utils/initgame')
const { FR } = require('./utils/consts')
const PORT = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const state = {}
const rooms = {}

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
    socket.on('newGame', handleNewGame)
    socket.on('joinGame', handleJoinGame)
    socket.on('keydown', handleKeyDown)
    socket.on('disconnect', handleDisconnect)
    let enemyDisconnected = false

    function startGameInterval(roomName) {
        const interval = setInterval(() => {
            const newGameState = updateGameState(state[roomName])
            const winner = newGameState.winner
            gameState = newGameState.newGameState
            if (winner == -1) {
                emitGameState(roomName, state[roomName])
            } else if (enemyDisconnected) {
                clearInterval(interval)
            } else {
                emitGameOver(roomName, winner)
                clearInterval(interval)
                state[roomName] = null
            }
        }, 1000/FR)
    }

    function handleNewGame() {
        let roomName = makeid()
        rooms[socket.id] = roomName
        socket.emit('gamecode', roomName)
        state[roomName] = initGame()
        socket.join(roomName)
        socket.number = 0
        socket.emit('init', 0)
    }
    function handleJoinGame(roomName) {
        const room = io.sockets.adapter.rooms[roomName];
    
        let allUsers;
        if (room) {
          allUsers = room.sockets;
        }
    
        let numClients = 0;
        if (allUsers) {
          numClients = Object.keys(allUsers).length;
        }
    
        if (numClients === 0) {
          socket.emit('unknownGame');
          return;
        } else if (numClients > 1) {
          socket.emit('tooManyPlayers');
          return;
        }
    
        rooms[socket.id] = roomName;
    
        socket.join(roomName);
        socket.number = 1;
        socket.emit('init', 1);
        
        startGameInterval(roomName);
    }
    function handleKeyDown(k) {
        const roomName = rooms[socket.id]

        if (!roomName) {
            return
        }

        try { const player = state[roomName].players[socket.number] } catch (err) { return }
        const player = state[roomName].players[socket.number]
        switch (k) {
            case 37: {
                if (player.vel.x != 1) {
                    player.vel.x = -1
                    player.vel.y = 0
                }
                break
            }
            case 39: {
                if (player.vel.x != -1) {
                    player.vel.x = 1
                    player.vel.y = 0
                }
                break
            }
            case 38: {
                if (player.vel.y != 1) {
                    player.vel.y = -1
                    player.vel.x = 0
                }
                break
            }
            case 40: {
                if (player.vel.y != -1) {
                    player.vel.y = 1
                    player.vel.x = 0
                }
                break
            }
        }
    }

    function handleDisconnect() {
            setTimeout(() => { 
                emitEnemyDisconnect(rooms[socket.id]) 
                enemyDisconnected = true
            }, 1000)   
    }

    function emitGameState(roomName, state) {
        io.sockets.in(roomName).emit('gamestate', state)
    }

    function emitGameOver(roomName, winner) {
        io.sockets.in(roomName).emit('gameover', winner)
    }

    function emitEnemyDisconnect(roomName) {
        // io.sockets.in(roomName).emit('enemydisconnect')
        socket.broadcast.emit('enemydisconnect', roomName)
        // io.to(roomName).emit('enemydisconnect')
    }
})

server.listen(PORT)