const coreDriver = require("../db/drivers/core-driver");
const ActionFactory = require("../factories/ActionFactory");
const { io } = require("./socket");
exports.userJoin = (game_id) => {
  const gameSpace = require("./socket").getNameSpace("game");
  const room = "game-" + game_id;
  gameSpace.on("connect", (socket) => {
    gameSpace.removeAllListeners();
    socket.join(room);
  });
};

exports.drawCard = async (game_user_list, card_id, performer) => {
  const room = "game-" + game_user_list[0].game_id;
  const users_id = game_user_list.map((game_user) => game_user.user_id);
  const game_id = game_user_list[0].game_id;
  const gameSpace = require("./socket").getNameSpace("game");
  try {
    const sockets = await gameSpace.in(room).fetchSockets();
    for await (socket of sockets) {
      const user_id = socket.request.session.userId;
      if (users_id.includes(user_id)) {
        const game_state = await coreDriver.getGameState(game_id, user_id);
        if (game_state) {
          const update = {};
          update.game_id = game_user_list[0].game_id;
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
          gameSpace.to(socket.id).emit("gameUpdate", {
            game_state: game_state,
            update: update,
          });
        } else {
          throw new Error("DB error");
        }
      } else {
        throw new Error("Forbidden");
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};
