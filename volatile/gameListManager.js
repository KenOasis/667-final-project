const gameList = [];
const db = require("../models");

const gamesDriver = require("../db/drivers/games-driver");
const findGameIndexById = (game_id) => {
  return gameList.findIndex((game) => game.game_id === game_id);
};

const events = require("../socket/eventsLobby");
/**
 * This is the Game List data manager for handler the
 * create/join/leav of game room in the lobby page
 * This is VOLATILE means once the server shutdowns/restarts
 * the data will be gone. check dummy_data at the end to see the format
 *
 */

const gameListManager = {
  init: function (list) {
    gameList = list;
  },
  getUserStatus: function (user_id) {
    /**
     * TODO
     * status of the user:
     *    all id(game_id) in games table which active (start === end time) and
     *   checked whether user_id is exist in corresponded game_users table and/or game_cards;
     *       If: == 0    => free
     *       If: exist in game-user but not in game-cards  => ready
     *       If: exist in both game-user and game-cards    => playing
     */
    let status_list = [];
    gameList.forEach((game) =>
      game.users.forEach((user) => {
        if (user.user_id === user_id) {
          status_list.push(user.status);
        }
      })
    );
    if (status_list.length === 0) {
      return "free";
    } else if (status_list.includes("playing")) {
      return "playing";
    } else {
      return "ready";
    }
  },
  setUserStatus: function (game_id, user_id, user_status) {
    // TODO check how status respresent..... this should be deprecated
    const gameIndex = findGameIndexById(game_id);
    const game = gameList[gameIndex];
    let username = "";
    game.users.forEach((user) => {
      if (user.user_id === user_id) {
        user.status = user_status;
        username = user.username;
      }
    });
    const userStatus = this.getUserStatus(user_id);
    events.userStatusUpdate(username, userStatus);
  },
  createGame: async function (game_name, user) {
    // TODO, actually add a game_user table for the game
    let gameCreated = null;
    try {
      gameCreated = await gamesDriver.createGame(game_name);
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
    const new_game = {
      game_id: gameCreated.id,
      name: game_name,
      users: [
        {
          user_id: user.user_id,
          username: user.username,
          status: "",
        },
      ],
      capacity: 4,
      status: "waiting",
    };
    gameList.push(new_game);
    this.setUserStatus(new_game.game_id, user.user_id, "ready");
    return new_game;
  },

  joinGame: function (game_id, user) {
    // TODO add add new rows game user tabe
    let gameIndex = findGameIndexById(game_id);
    let game = gameList[gameIndex];
    if (game.users.length >= game.capacity) {
      return false;
    } else {
      game.users.push({
        user_id: user.user_id,
        username: user.username,
        status: "",
      });
      this.setUserStatus(game_id, user.user_id, "ready");
      if (game.users.length === game.capacity) {
        game.status = "full";
      }
      return game;
    }
  },

  leaveGame: function (game_id, user) {
    // TODO delete a game from game_user table
    let gameIndex = findGameIndexById(game_id);
    let game = gameList[gameIndex];
    game.users = game.users.filter(
      (element) => element.user_id != user.user_id
    );
    const userStatus = gameListManager.getUserStatus(user.user_id);
    events.userStatusUpdate(user.username, userStatus);
    if (game.users.length <= 0) {
      // remove the game without any player
      gameList.splice(gameIndex, 1);
      return ["removed", game];
    }
    return ["existed", game];
  },
  initGame: function (game_id) {
    //TODO this should be deprecated .....
    const gameIndex = findGameIndexById(game_id);
    const game = gameList[gameIndex];
    game.users.forEach((user) => {
      this.setUserStatus(game_id, user.user_id, "playing");
    });
    game.status = "playing";
    return game;
  },
  userLeaveLobby: function (user_id) {
    // TODO should delate a row in game user table if it is not started (not game_cards)
    let index = gameList.length;
    while (index > 0) {
      index--;
      game = gameList[index];
      game.users = game.users.filter(
        (user) => user.status === "playing" || user.user_id !== user_id
      );

      if (game.users.length <= 0) {
        gameList.splice(index, 1);
      }
    }
    return gameList;
  },
  getUserListOfGame: function (game_id) {
    // TODO should be genearte from db
    let gameIndex = findGameIndexById(game_id);
    if (gameIndex >= 0) {
      let game = gameList[gameIndex];
      return game.users;
    }
    return null;
  },
  getGameList: function () {
    // TODO recontruct the game list from db
    return gameList;
  },
};

module.exports = gameListManager;

const dummy_data = {
  game_id: 2,
  name: "Uno!",
  users: [
    {
      user_id: "5",
      username: "Joey88",
      status: "ready", // "ready" -> in the game room waiting;  "playing" -> in the game
    },
    {
      user_id: "8",
      username: "Jason2319",
      status: "ready",
    },
  ],
  capacity: 4,
  status: "waiting", // "waiting" -> not full; "full" -> game is full soon to start; "playing" -> in the game
};
