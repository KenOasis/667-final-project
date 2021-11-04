exports.initGame = (req, res, next) => {
  const game_id = req.body.game_id;
  const users_id = req.body.users_id; // This should be an array of all user's user_id for the game
  // TODO initial a game (insert and update all necessary table)
  // decide game order, draw initial cards, decide initial status (color, number) for the first round
}

exports.drawCard = (req, res, next) => {
  const game_id = req.body.game_id;
  const users_id = req.body.user_id;
}
exports.playCard = (req, res, next) => {
  const game_id = req.body.game_id;
  const user_id = req.body.user_id;
  const card_id = req.body.card_id;
  const wild_color = req.body.wild_status; // if the card is wild card, the current player need to select a color 
  // TODO according the card's action_type to trigger futher action 
}

exports.challenge = (req, res, next) => {
  const game_id = req.body.game_id;
  const user_id = req.body.user_id;
  const challenge = req.body.challenge;   // Boolean status as whether to do the challenge
  const wild_color = req.body.card_id; // The color picked by the user to do the challenge (if they try to do the challenge)
  // TODO updated the game state as the result of the challenge
}

exports.sayUno = (req, res, next) => {
  
}
