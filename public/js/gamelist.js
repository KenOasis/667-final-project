const findGameById = (game_list, game_id) => {
    return game_list.findIndex(game => 
       game.game_id === game_id);
};

const gameListManager = {
  init: (list) => {
    gameList = list
  },
  createGame: (new_game) => {
    gameList.push(new_game);
    return new_game
  },

  joinGame: (game_id, user) => {
    let gameIndex = findGameById(gameList, game_id);
    let game = gameList[gameIndex];
    if (game.users.length >= game.capacity) {
      return null;
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
    let gameIndex = findGameById(gameList, game_id);
    let game = gameList[gameIndex];
    game.users = game.users.filter(element => element.user_id != user.user_id);
    if (game.users.length <= 0) {
      gameList.splice(gameIndex, 1);
      return null;
    } else {
      return game;
    }
  },
  startGame: (game_id) => {
    const gameIndex = findGameById(gameList, game_id);
    const game = gameList[gameIndex];
    game.users.forEach(user => {
      user.status = "playing"
    });
    game.status = "in game"
  },
  getUserList: (game_id) => {
    const gameIndex = findGameById(gameList, game_id);
    if (gameIndex >= 0) {
      return gameList[gameIndex].users;
    }
    return [];
  },
  userLeaveLobby: (user_id) => {
    let index = gameList.length;
    while (index > 0) {
      index--;
      game = gameList[index];
      console.log(index);
      console.log(game);
      game.users = game.users.filter(user => user.user_id !== user_id || user.status === "playing");
      if (game.users.length <= 0) {
        gameList.splice(index, 1);
      }
    }
    return gameList;
  },
  getGameList: () => {
    return gameList;
  }
}

// module.exports = gameListManager;