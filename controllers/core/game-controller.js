exports.initGame = (req, res, next) => {
  const game_id = req.body.game_id;
  const users_id = req.body.users_id; // This should be an array of all user's user_id for the game


  // TODO
  // 1. add users to game_user table in randomized order
  //    - get all users id's into an array
  //    - shuffle that array
  //    - insert that array's users into the game_users table
  // 2. insert all cards into game_cards table in random draw order
  //    - get id's of all cards into an array
  //    - shuffle that array
  //    - insert that array's cards into the game_cards table
  // 3. draw initial cards for the players
  //    - assign the first cards in the game_cards table to the users in that order
  // 4. draw the initial discard pile card
  //    - tbd
  // 5. set direction randomly (forward or backward)
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
