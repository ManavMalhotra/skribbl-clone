class Game {
    constructor() {
      this.games = {};
    }
  
    addPlayer(roomId, playerName) {
      if (!this.games[roomId]) {
        this.games[roomId] = {
          players: [],
          isGameStarted: false,
        };
      }
  
      this.games[roomId].players.push(playerName);
    }
  
    getPlayers(roomId) {
      return this.games[roomId].players;
    }
  
    removePlayer(roomId, socketId) {
      const game = this.games[roomId];
      const playerIndex = game.players.findIndex((player) => player.socketId === socketId);
      const player = game.players.splice(playerIndex, 1)[0];
      return player.name;
    }
  
    canGameStart(roomId) {
      const game = this.games[roomId];
      return game.players.length >= 2 && !game.isGameStarted;
    }
  }
  
  module.exports = new Game();
  