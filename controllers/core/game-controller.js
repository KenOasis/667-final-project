const GameUsers = db['game_users'];
const GameCards = db['game_cards'];
const Cards = db['cards'];


exports.initGame = (req, res, next) => {
  const game_id = req.body.game_id;
  const user_ids = req.body.users_id; // This should be an array of all user's user_id for the game

  // 1

  userIdsShuffled = shuffle(user_ids)

  let userIdsOrderCounter = 0

  userIdsShuffled.array.forEach(element => {
    GameUsers.create({
      game_id: game_id,
      user_id: element,
      current_player: false,
      initial_order: userIdsOrderCounter,
      points: 0
    })
    userIdsOrderCounter += 1;
  });

  // 2

  allCardsIds = await Cards.findAll().map((item) => {
      return item.card_id
  });

  allCardsIdsShuffled = shuffle(allCardsIds)

  let cardIdsOrderCounter = 0

  allCardsIdsShuffled.forEach(element => {
    GameCards.create({
      game_id: game_id,
      user_id: 0,
      card_id: element,
      draw_order: cardIdsOrderCounter,
      in_deck: false,
      discarded: false
    })
    cardIdsOrderCounter += 1;
  })

  // 3

  initialCardsIds = await GameCards.findAll({
    order: [
      ['draw_order', 'ASC']
    ],
    attributes: ['id'],
    limit: 28
  })

  let indexCounter = 0

  initialCardsIds.forEach(element => {
    GameCards.update(
      { 
        user_id: user_ids[indexCounter],
        in_deck: true
      },
      { where: { id: element }}
    )
    indexCounter = (indexCounter + 1) % 4
  })






  // TODO
  // 1. add users to game_user table in randomized order
  //    - get all users id's into an array - CHECK
  //    - shuffle that array - CHECK
  //    - insert that array's users into the game_users table - CHECK
  // 2. insert all cards into game_cards table in random draw order
  //    - get id's of all cards into an array - CHECK
  //    - shuffle that array - CHECK
  //    - insert that array's cards into the game_cards table - CHECK
  // 3. draw initial 7 cards for the players
  //    - get ids of first 28 (7*4) cards from game_cards by draw_order - CHECK
  //    - update these cards in game_cards with the corresponding user_id && update in_deck to true - CHECK
  // 4. draw the initial discard pile card
  //    - tbd
  // 5. set direction randomly (forward or backward)
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle
  while (currentIndex != 0) {

    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
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
