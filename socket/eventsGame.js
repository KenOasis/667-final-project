const coreDriver = require("../db/drivers/core-driver");
const ActionFactory = require("../factories/actionFactory");
const moment = require("moment");
exports.userJoin = (game_id, user_list) => {
  const gameSpace = require("./socket").getNameSpace("game");
  const room = "game-" + game_id;
  gameSpace.removeAllListeners();
  let users_id = user_list.map((user) => user.user_id);
  gameSpace.on("connect", (socket) => {
    socket.join(room);
    const timestamp = moment();
    const username = socket.request.session.userName;
    gameSpace.in(room).emit("userJoin", { username, timestamp });
    gameSpace
      .in(room)
      .fetchSockets()
      .then((sockets) => {
        sockets.forEach((socket) => {
          // ensure that the 4 connects players is the player in the corresponded game
          const socket_user_id = socket.request.session.userId;
          const index = users_id.findIndex(
            (user_id) => user_id === socket_user_id
          );
          if (index >= 0) {
            users_id.splice(index, 1);
          }
        });
        if (sockets.length === 4 && users_id.length === 0) {
          gameSpace.in(room).emit("gameStart", { game_id });
        }
      });
    socket.on("disconnect", () => {
      gameSpace.in(room).emit("userDisconnect", { username, timestamp });
      socket.leave(room);
    });
  });
};

exports.drawCard = async (game_user_list, card_id, performer) => {
  const game_id = game_user_list[0].game_id;
  const room = "game-" + game_id;
  const users_id = game_user_list.map((game_user) => game_user.user_id);
  const gameSpace = require("./socket").getNameSpace("game");
  try {
    const sockets = await gameSpace.in(room).fetchSockets();
    for await (socket of sockets) {
      const user_id = socket.request.session.userId;
      if (users_id.includes(user_id)) {
        const game_state = await coreDriver.getGameState(game_id, user_id);
        if (game_state) {
          const update = {};
          update.game_id = game_id;
          update.receiver = user_id;
          update.actions = [];
          const card = [];
          card.push(card_id);
          const drawCardAction = ActionFactory.create("draw_card", {
            performer: performer,
            card: card,
            receiver: user_id,
          });
          update.actions.push(drawCardAction);
          gameSpace.in(socket.id).emit("gameUpdateDrawCard", {
            game_state: game_state,
            update: update,
          });
        }
      } else {
        throw new Error("Forbidden");
      }
    }
  } catch (err) {
    throw err;
  }
};

exports.pass = async (game_user_list, performer) => {
  const game_id = game_user_list[0].game_id;
  const room = "game-" + game_id;
  const users_id = game_user_list.map((game_user) => game_user.user_id);
  const gameSpace = require("./socket").getNameSpace("game");
  try {
    const sockets = await gameSpace.in(room).fetchSockets();
    for await (socket of sockets) {
      const user_id = socket.request.session.userId;
      if (users_id.includes(user_id)) {
        const game_state = await coreDriver.getGameState(game_id, user_id);
        if (game_state) {
          const update = {};
          update.game_id = game_id;
          update.receiver = user_id;
          update.actions = [];
          const passAction = ActionFactory.create("pass", {
            performer: performer,
          });
          update.actions.push(passAction);
          gameSpace.in(socket.id).emit("gameUpdatePass", {
            game_state: game_state,
            update: update,
          });
        }
      } else {
        throw new Error("Forbidden");
      }
    }
  } catch (err) {
    throw err;
  }
};
// the performer of playCard() is the player who played this card
// the performet in the next_cation is the performer of the next_action
exports.playCard = async (game_user_list, card_id, performer, next_action) => {
  const game_id = game_user_list[0].game_id;
  const room = "game-" + game_id;
  const users_id = game_user_list.map((game_user) => game_user.user_id);
  const gameSpace = require("./socket").getNameSpace("game");
  try {
    const [isUnoPenalty, cards] = await coreDriver.checkUnoPenalty(
      game_id,
      performer
    );
    if (isUnoPenalty) {
      await coreDriver.resetUno(game_id, performer);
    }
    const sockets = await gameSpace.in(room).fetchSockets();
    for await (socket of sockets) {
      const user_id = socket.request.session.userId;
      if (users_id.includes(user_id)) {
        let game_state = await coreDriver.getGameState(game_id, user_id);
        if (game_state) {
          const update = {};
          update.game_id = game_id;
          update.receiver = user_id;
          update.actions = [];
          const card = [];
          card.push(card_id);
          const playCardAction = ActionFactory.create("play_card", {
            performer: performer,
            card: card,
          });
          update.actions.push(playCardAction);

          if (isUnoPenalty) {
            // has penalty
            const unoPenaltyAction = ActionFactory.create("uno_penalty", {
              performer: performer,
              cards: cards,
              receiver: user_id,
            });
            update.actions.push(unoPenaltyAction);
            // reset uno of ther performer (who played card)
            game_state = await coreDriver.getGameState(game_id, user_id);
          }

          switch (next_action.action) {
            case "none":
              {
                gameSpace.in(socket.id).emit("gameUpdatePlayCard", {
                  game_state: game_state,
                  update: update,
                });
              }
              break;
            case "reverse":
              {
                const reverseAction = ActionFactory.create("reverse", {
                  performer: performer,
                });
                update.actions.push(reverseAction);
                gameSpace.in(socket.id).emit("gameUpdateReverse", {
                  game_state: game_state,
                  update: update,
                });
              }
              break;
            case "skip":
              {
                const skipAction = ActionFactory.create("skip", {
                  performer: next_action.performer,
                });
                update.actions.push(skipAction);
                gameSpace.in(socket.id).emit("gameUpdateSkip", {
                  game_state: game_state,
                  update: update,
                });
              }
              break;
            case "draw_two":
              {
                const drawTwoAction = ActionFactory.create("draw_two", {
                  performer: next_action.performer,
                  cards: next_action.cards,
                  receiver: user_id,
                });
                update.actions.push(drawTwoAction);
                gameSpace.in(socket.id).emit("gameUpdateDrawTwo", {
                  game_state: game_state,
                  update: update,
                });
              }
              break;
            case "wild":
              {
                const wildAction = ActionFactory.create("wild", {
                  performer: performer,
                  color: next_action.color,
                });
                update.actions.push(wildAction);
                gameSpace.in(socket.id).emit("gameUpdateWild", {
                  game_state: game_state,
                  update: update,
                });
              }
              break;
            case "wild_draw_four":
              {
                const wildAction = ActionFactory.create("wild_draw_four", {
                  performer: performer,
                  color: next_action.color,
                });
                update.actions.push(wildAction);
                gameSpace.in(socket.id).emit("gameUpdateWildDrawFour", {
                  game_state: game_state,
                  update: update,
                });
              }
              break;
            default:
              {
                throw new Error("Events data error!");
              }
              break;
          }
        }
      } else {
        throw new Error("Forbidden");
      }
    }
  } catch (err) {
    throw err;
  }
};

exports.sayUno = async (game_user_list, performer) => {
  const game_id = game_user_list[0].game_id;
  const room = "game-" + game_id;
  const users_id = game_user_list.map((game_user) => game_user.user_id);
  const gameSpace = require("./socket").getNameSpace("game");
  try {
    const sockets = await gameSpace.in(room).fetchSockets();
    for await (socket of sockets) {
      const user_id = socket.request.session.userId;
      if (users_id.includes(user_id)) {
        const game_state = await coreDriver.getGameState(game_id, user_id);
        if (game_state) {
          const update = {};
          update.game_id = game_id;
          update.receiver = user_id;
          update.actions = [];
          const unoAction = ActionFactory.create("uno", {
            performer: performer,
          });
          update.actions.push(unoAction);
          gameSpace.in(socket.id).emit("sayUnoUpdate", {
            game_state: game_state,
            update: update,
          });
        }
      } else {
        throw new Error("Forbidden");
      }
    }
  } catch (err) {
    throw err;
  }
};

exports.challenge = async (
  game_user_list,
  performer,
  is_challenge,
  is_success,
  penalty_id,
  penalty_cards
) => {
  const game_id = game_user_list[0].game_id;
  const room = "game-" + game_id;
  const users_id = game_user_list.map((game_user) => game_user.user_id);
  const gameSpace = require("./socket").getNameSpace("game");
  try {
    const sockets = await gameSpace.in(room).fetchSockets();
    for await (socket of sockets) {
      const user_id = socket.request.session.userId;
      if (users_id.includes(user_id)) {
        const game_state = await coreDriver.getGameState(game_id, user_id);
        if (game_state) {
          const update = {};
          update.game_id = game_id;
          update.receiver = user_id;
          update.actions = [];
          const challengeAction = ActionFactory.create("challenge", {
            performer: performer,
            is_challenge: is_challenge,
            is_success: is_success,
            penalty_player: penalty_id,
            penalty_cards: penalty_cards,
            receiver: user_id,
          });
          update.actions.push(challengeAction);
          if (is_challenge) {
            if (is_success) {
              gameSpace.in(socket.id).emit("challengeSuccessUpdate", {
                game_state: game_state,
                update: update,
              });
            } else {
              gameSpace.in(socket.id).emit("challengeFailUpdate", {
                game_state: game_state,
                update: update,
              });
            }
          } else {
            gameSpace.in(socket.id).emit("notChallengeUpdate", {
              game_state: game_state,
              update: update,
            });
          }
        }
      } else {
        throw new Error("Forbidden");
      }
    }
  } catch (err) {
    throw err;
  }
};

exports.endGame = async (game_results) => {
  const gameSpace = require("./socket").getNameSpace("game");
  const game_id = game_results.game_id;
  const room = `game-${game_id}`;
  const user_id_list = game_results.results.map((user) => user.user_id);
  try {
    const sockets = await gameSpace.in(room).fetchSockets();
    if (sockets && sockets.length == 4) {
      for await (socket of sockets) {
        const user_id = socket.request.session.userId;
        if (user_id_list.includes(user_id)) {
          const game_state = await coreDriver.getGameState(game_id, user_id);
          gameSpace.in(socket.id).emit("endGameUpdate", {
            game_state,
            results: game_results,
          });
        } else {
          throw new Error("Forbidden");
        }
      }
    } else {
      throw new Error("Fetch player socket failed!");
    }
  } catch (err) {
    throw err;
  }
};

exports.sendChat = (game_id, username, timestamp, message) => {
  const gameSpace = require("./socket").getNameSpace("game");
  const room = "game-" + game_id;
  gameSpace.in(room).emit("chat", {
    username,
    timestamp,
    message,
  });
};
