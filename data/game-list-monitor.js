const gameList = [];
const db = require('../models/');
const Games = db['games'];
const findGameById = (game_id) => {
  return gameList.findIndex(game => 
     game.game_id === game_id);
}

const getGameId = () => {

}
const gameListManager = {
  /*
  * @user = {
  *    user_id,
  *    user_name
  *  }
  */
  createGame: async (game_name, user) => {
    let gameCreated = null;
    try {
      gameCreated = await Games.create({
        name: game_name
      });
    } catch (err) {
      console.log(err)
    }
    const new_game = {
      game_id: gameCreated.id,
      name: game_name,
      users: [{
        user_id: user.user_id,
        username: user.username,
        status: "ready"
      }],
      capacity: 4,
      status: "waiting" 
    }
    gameList.push(new_game);
  },

  joinGame: (game_id, user) => {
    let gameIndex = findGameById(game_id);
    let game = gameList[gameIndex];
    if (game.users.length >= capacity) {
      throw new Error("Joined game failed since the game is full");
    } else {
      game.users.push({
        user_id: user.user_id,
        username: user.username,
        status: "ready"
      })
    }
  },

  leaveGame: (game_id, user) => {
    let gameIndex = findGameById(game_id);
    let game = gameList[gameIndex];
    if (game.users.length >= capacity) {
      throw new Error("Joined game failed since the game is full");
    } else {
      game.users = game.users.filter(element => element.user_id != user.user_id);
    }
    if (game.users.length === 0) {
      gameList = gameList.filter(game => game.game_id !== game_id);
      // TODO change finished_at in db ???
    }
  },
  startGame: (game_id) => {
    const gameIndex = findGameById(game_id);
    const game = gameList[gameIndex];
    game.users.forEach(user => {
      user.status = "playing"
    });
    game.status = "in game"
  },
  getGameList: () => {
    return gameList;
  }
}

module.exports = gameListManager;