const gameList = [];
const db = require('../models');
const Games = db['games'];

const gamesDriver = require('../db/drivers/games-driver');
const findGameIndexById = (game_id) => {
  return gameList.findIndex(game => 
     game.game_id === game_id);
}
/** 
 * This is the Game List data manager for handler the 
 * create/join/leav of game room in the lobby page
 * This is VOLATILE means once the server shutdowns/restarts
 * the data will be gone. check dummy_data at the end to see the format
 */
const gameListManager = {
  
  init: (list) => {
    gameList = list
  },
  createGame: async (game_name, user) => {
    let gameCreated = null;
    try {
      gameCreated = await gamesDriver.createGame(game_name);
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
    return new_game
  },

  joinGame: (game_id, user) => {
    let gameIndex = findGameIndexById(game_id);
    let game = gameList[gameIndex];
    if (game.users.length >= game.capacity) {
      return false;
    } else {
      game.users.push({
        user_id: user.user_id,
        username: user.username,
        status: "ready"
      })
      if (game.users.length === game.capacity) {
        game.status = "full";
      }
      return game;
    }
  },

  leaveGame: (game_id, user) => {
    let gameIndex = findGameIndexById(game_id);
    let game = gameList[gameIndex];
    console.log("game : " + gameIndex);
    game.users = game.users.filter(element => element.user_id != user.user_id);
    if (game.users.length <= 0) {
      // remove the game without any player
      gameList.splice(gameIndex, 1);
      return ["removed", game];
    }
    return ["existed", game];
  },
  startGame: (game_id) => {
    const gameIndex = findGameIndexById(game_id);
    const game = gameList[gameIndex];
    game.users.forEach(user => {
      user.status = "playing"
    });
    game.status = "in game";
  },

  getUserStatus: (user_id) => {
    let status_list = [];
    gameList.forEach(game => game.users.forEach(user => {
      if (user.user_id === user_id) {
        status_list.push(user.status);
      }
    }));
    if (status_list.length === 0) {
      return "free";
    } else if(status_list.includes("playing")) {
      return "playing";
    } else {
      return "ready";
    }
  },

  userLeaveLobby: (user_id) => {
    let index = gameList.length;
    while (index > 0) {
      index--;
      game = gameList[index];
      game.users = game.users.filter(user => user.user_id !== user_id || user.status === "playing");
      if (game.users.length <= 0) {
        gameList.splice(index, 1);
      }
    }
    return gameList; 
  },
  getUserListOfGame: (game_id) => {
    let gameIndex = findGameIndexById(game_id);
    if (gameIndex >= 0 ) {
      let game = gameList[gameIndex];
      let users_id = game.users.map(user => user.user_id);
      return users_id
    } 
    return null;
  },
  getGameList: () => {
    return gameList;
  }
}

module.exports = gameListManager;

const dummy_data = {
  game_id: 2,
  name: "Uno!",
  users: [{
    user_id: "5",
    username: "Joey88",
    status: "ready"  // "ready" -> in the game room waiting;  "playing" -> in the game 
  },{
    user_id: "8",
    username: "Jason2319",
    status: "ready"  
  }],
  capacity: 4, 
  status: "waiting" // "waiting" -> not full; "full" -> game is full soon to start; "playing" -> in the game 
}