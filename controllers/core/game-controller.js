const gameUsersDriver = require('../../db/drivers/game-users-driver');
const cardsDriver = require('../../db/drivers/card-drivers');
const gameCardsDriver = require('../../db/drivers/game-cards-driver');
const shuffle = require('../../util/shuffle');

const gameStateDummy = require('../../volatile/gameStateDummy');
exports.initGame = async (req, res, next) => {
  const { game_id, users_id } = req.body;

  try {
  // Step 0 : check whether the game is initialed already.
    const game_users = await gameUsersDriver.getGameUsersByGameId(game_id);

    if (game_users && game_users.length) {
      // TODO retrive all data and save 
    } else {
      // Step 1 : Generate the random sequence of starting order of user
      // referrence: async iteration https://2ality.com/2016/10/asynchronous-iteration.html
    const userIdsShuffled = shuffle(users_id);
    let userIdsOrderCounter = 1;
  
      for await (const user_id of userIdsShuffled) {
        await gameUsersDriver.createGameUsers(game_id, user_id, false, userIdsOrderCounter);
        userIdsOrderCounter += 1;
      }
      // Stpe 2: Generate the 108 game_card rows and give them an random draw order. 
    
      const allCardsIds = await cardsDriver.getAllCardsId();

      const allCardsIdsShuffled = shuffle(allCardsIds);
      
      let cardIdsOrderCounter = 1;
      
      for await (const card_id of allCardsIdsShuffled) {
        await gameCardsDriver.initialGameCards(game_id, userIdsShuffled[0], card_id, cardIdsOrderCounter);

        cardIdsOrderCounter += 1;
      }
    }
 
    // 3 Generate the first 28 cards (4 for each player) for the initial game stage

    // initialCardsIds = await GameCards.findAll({
    //   where: {
    //     in_deck: true,
    //     discarded: false
    //   },
    //   order: [
    //     ['draw_order', 'ASC']
    //   ],
    //   attributes: ['id'],
    //   limit: 28
    // });

    // let indexCounter = 0;

    // initialCardsIds.forEach(element => {
    //   GameCards.update(
    //     { 
    //       user_id: users_id[indexCounter],
    //       in_deck: true
    //     },
    //     { where: { id: element }}
    //   )
    //   indexCounter = (indexCounter + 1) % 4
    // })

    // // 4

    // potentialInitialCardsIds = await GameCards.findAll({
    //   where: {
    //     discarded: false,
    //     in_deck: false,
    //     user_id: 0
    //   },
    //   order: [
    //     ['draw_order', 'ASC']
    //   ],
    //   attributes: ['id']
    // });

    // initialCardId = firstNonActionCard(potentialInitialCardsIds);

    // await GameCards.update(
    //   {discarded: true},
    //   {where: { card_id: initialCardId }}
    // );

    // // 5

    // gameDirection = Math.round(Math.random());

    // await Games.update(
    //   {direction: gameDirection},
    //   {where: { id: game_id }}
    // );
    
    res.status(200).json({message: "666"});
    
    } catch (err) {
      console.error(err);
    }

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
  //    - get first card that is not: -discarded -in_deck && has user_id=0 ordered by draw_order ASC where action=NULL CHECK
  // 5. set direction randomly (forward or backward)
}


// function firstNonActionCard(ids) {
//   for (i = 0; i < ids.length; i++) {
//     action = await Cards.findAll({
//       where: {id: ids[i]},
//       attributes: ['action']
//     })
//     //TODO correct data type 'card_actions.no_action' ???
//     if (action == card_actions.no_action) {
//       return ids[i]
//     }
//   }
// }

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

exports.generateGameState = (req, res, next) => {
  const game_state = gameStateDummy.getGameState();
  res.status(200).json({
    game_state: game_state
  })
}