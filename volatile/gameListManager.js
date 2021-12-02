const lobbyDriver = require("../db/drivers/lobby-driver");
const coreDriver = require("../db/drivers/core-driver");
const eventsLobby = require("../socket/eventsLobby");
const e = require("cors");
/**
 * This is the Game List data manager for handler the
 * create/join/leav of game room in the lobby page
 * This is VOLATILE means once the server shutdowns/restarts
 * the data will be gone. check dummy_data at the end to see the format
 *
 */

const gameListManager = {
  getGameList: async function () {
    try {
      const gameList = await lobbyDriver.getGameList();
      return gameList;
    } catch (err) {
      console.error(err);
    }
  },
  getUserStatus: async function (user_id) {
    let gameList = [];
    try {
      gameList = await this.getGameList();
    } catch (err) {
      console.error(err);
      return "error";
    }
    let status_list = [];
    gameList.forEach((game) =>
      game.users.forEach((user) => {
        if (user.user_id === user_id) {
          status_list.push(user.status);
        }
      })
    );
    if (status_list.length === 0) {
      return ["free", gameList];
    } else if (status_list.includes("playing")) {
      return ["playing", gameList];
    } else {
      return ["ready", gameList];
    }
  },
  createGame: async function (game_name, user) {
    try {
      const isGameCreated = await lobbyDriver.createGame(game_name, user);

      if (isGameCreated) {
        const [userStatus, gameList] = await this.getUserStatus(user.user_id);
        eventsLobby.userStatusUpdate(user.username, userStatus);
        return gameList;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  },

  joinGame: async function (game_id, user) {
    try {
      const joinStatus = await lobbyDriver.joinGame(game_id, user);
      if (joinStatus === true) {
        const [userStatus, gameList] = await this.getUserStatus(user.user_id);
        eventsLobby.userStatusUpdate(user.username, userStatus);
        return gameList;
      } else if (joinStatus === false) {
        return [];
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  },

  leaveGame: async function (game_id, user) {
    // TODO delete a game from game_user table
    try {
      const isLeft = await lobbyDriver.leaveGame(game_id, user);
      if (isLeft) {
        const [userStatus, gameList] = await this.getUserStatus(user.user_id);
        eventsLobby.userStatusUpdate(user.username, userStatus);
        return gameList;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  },
  initGame: async function (game_id) {
    try {
      const [isGameFull, user_list] = await lobbyDriver.checkGameFull(game_id);
      if (isGameFull && user_list && user_list.length) {
        const user_id_list = user_list.map((user) => user.user_id);
        const isInitialSuccess = await coreDriver.initialGame(
          game_id,
          user_id_list
        );
        let gameList = [];
        let userStatus = "ready";
        for await (user of user_list) {
          [userStatus, gameList] = await this.getUserStatus(user.user_id);
          eventsLobby.userStatusUpdate(user.username, userStatus);
        }
        if (isInitialSuccess) {
          eventsLobby.initGame(game_id, user_id_list, gameList);
        } else {
          throw new Error("Initial game failed");
        }
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  },
  userLeaveLobby: function (user_id) {
    // TODO should delate a row in game user table if it is not started (not game_cards)
    // let index = gameList.length;
    // while (index > 0) {
    //   index--;
    //   game = gameList[index];
    //   game.users = game.users.filter(
    //     (user) => user.status === "playing" || user.user_id !== user_id
    //   );
    //   if (game.users.length <= 0) {
    //     gameList.splice(index, 1);
    //   }
    // // }
    // return gameList;
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

// Construct game_list
/**
 * SELECT id, name FROM games
 * WHERE created_at = finished_at
 * ~game_id = id, ~ name = name
 * ~capacity = 4, ~status: "waiting"
 * map => []
 * forEach
 * SELECT users.id, users.username, game_users.initial_order
 * FROM users INNER JOINS game_users
 * WHERE .....
 * AND game_users.game_id = (game_id)
 *
 * forEach ~user_id = users.id, ~ username = users.username,
 * ~ status: game_initial_order === 0 ? "ready" : "playing" (also change game.status)
 *  => push in users[];
 */
