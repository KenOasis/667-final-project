const lobbyDriver = require("../drivers/lobby-driver");
const coreDriver = require("../drivers/core-driver");
const eventsLobby = require("../../socket/eventsLobby");
const e = require("cors");
/**
 * This is the Game List data manager for handler the
 * create/join/leavy of game room in the lobby page
 * This is VOLATILE means once the server shutdowns/restarts
 * the data will be gone. check dummy_data at the end to see the format
 *
 */

const gameListManager = {
  /**
   *
   * @returns game_list structure check dummby data
   */
  getGameList: async function () {
    try {
      const game_list = await lobbyDriver.getGameList();
      return game_list;
    } catch (err) {
      console.error(err);
    }
  },

  /**
   *
   * @param {*} user_id
   * @returns [user.status, game_list]
   */
  getUserStatus: async function (user_id) {
    let game_list = [];
    try {
      game_list = await this.getGameList();
    } catch (err) {
      console.error(err);
      return "error";
    }
    let status_list = [];
    game_list.forEach((game) =>
      game.users.forEach((user) => {
        if (user.user_id === user_id) {
          status_list.push(user.status);
        }
      })
    );
    if (status_list.length === 0) {
      return ["free", game_list];
    } else if (status_list.includes("playing")) {
      return ["playing", game_list];
    } else {
      return ["ready", game_list];
    }
  },

  /**
   *
   * @param {*} game_name
   * @param {*} user
   * @returns game_list
   */
  createGame: async function (game_name, user) {
    try {
      const is_game_created = await lobbyDriver.createGame(game_name, user);

      if (is_game_created) {
        const [user_status, game_list] = await this.getUserStatus(user.user_id);
        eventsLobby.userStatusUpdate(user.username, user_status);
        return game_list;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  },

  /**
   *
   * @param {*} game_id
   * @param {*} user
   * @returns [user.status, game_list] | [];
   */
  joinGame: async function (game_id, user) {
    try {
      const join_status = await lobbyDriver.joinGame(game_id, user);
      if (join_status === true) {
        const [user_status, game_list] = await this.getUserStatus(user.user_id);
        eventsLobby.userStatusUpdate(user.username, user_status);
        return game_list;
      } else if (join_status === false) {
        return [];
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  },

  /**
   *
   * @param {*} game_id
   * @param {*} user
   * @returns game_list
   */
  leaveGame: async function (game_id, user) {
    // TODO delete a game from game_user table
    try {
      const is_left = await lobbyDriver.leaveGame(game_id, user);
      if (is_left) {
        const [user_status, game_list] = await this.getUserStatus(user.user_id);
        eventsLobby.userStatusUpdate(user.username, user_status);
        return game_list;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  },

  /**
   * Change the game.status and user.status when game is initiled
   * @param {*} game_id
   * @returns
   */
  initGame: async function (game_id) {
    try {
      const [is_game_full, user_list] = await lobbyDriver.checkGameFull(
        game_id
      );
      if (is_game_full && user_list && user_list.length) {
        const user_id_list = user_list.map((user) => user.user_id);
        const is_initial_success = await coreDriver.initialGame(
          game_id,
          user_id_list
        );
        let game_list = [];
        let user_status = "ready";
        for await (user of user_list) {
          [user_status, game_list] = await this.getUserStatus(user.user_id);
          eventsLobby.userStatusUpdate(user.username, user_status);
        }
        if (is_initial_success) {
          eventsLobby.initGame(game_id, user_id_list, game_list);
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
  status: "waiting", // "waiting" -> not full; "playing" -> game started
};
