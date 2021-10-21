const { result } = require('../../db');
const db = require('../../models')
const Games = db['games'];
const Game_users = db['game_users'];
const Game_cards = db['game_cards'];
const Cards = db['cards'];
const orderGenerator = require('../../util/order_generator').orderGenerator;
exports.showAllCards = async (req, res, next) => {
  Cards.findAll({raw: true})
    .then(cards => res.json({cards}))
    .catch(error => res.json({error})); 
}

exports.testGame = (req, res, next) => {
  const game_name = "Uno Camp";
  Games.create({name: game_name})
    .then(results => {
      res.status(200).json({
        name: results.name,
        created_at: results.created_at,
        finished_at: results.finished_at,
        direction: results.direction
      })
    }).catch(error => {
      console.log(error);
      res.json({error: error})
    })
}

exports.testGameUsers = (req, res, next) => {
  const game_id = 1;
  const users_ids = [1,2,3,4];
  const users_initial_orders = [4,2,1,3];
  const rows_bulk = [];
  for(let i = 0; i < users_ids.length; ++i) {
    rows_bulk.push({
      game_id: game_id,
      user_id: users_ids[i],
      current_player: true,
      initial_order: users_initial_orders[i],
    });
  }

  Game_users.bulkCreate(rows_bulk)
    .then(results => {
      res.status(200).json({results})
    })
    .catch(error => {
      console.log(error);
      res.json({error: error});
    })
}

exports.testGameCards = (req, res, next) => {
  const game_id = 1;
  const user_id = 2;
  const card_id = 108;
  const draw_order = 88;
  Game_cards.create({
    game_id,
    user_id,
    card_id,
    draw_order
  }).then(results => {
    res.status(200).json({
      id: results.id,
      game_id: results.game_id,
      user_id: results.user_id,
      card_id: results.card_id,
      draw_order: results.draw_order,
      in_deck: results.in_deck,
      discarded: results.discarded
    })
  }).catch(error => {
    console.log(error);
    res.json({error: error});
  })
}

exports.initialGame = async (req, res, next) => {

  let game_name = "new Game";
  let players = [1,2,3,4];
  let players_order = orderGenerator(1, 4);
  let draw_order = orderGenerator(1, 108);
  let rows_bulk_gu = [];
  let rows_bulk_gc = [];
  let cards;
  let game;
  let game_users;
  let game_cards;


  try {
    cards = await Cards.findAll({raw:true});
    game = await Games.create({
      name: game_name
    });

    for (let i = 0; i < players.length; ++i) {
      rows_bulk_gu.push({
        game_id: game.id,
        user_id: players[i],
        current_player: true,
        initial_order: players_order[i]
      });
    }
    game_users = await Game_users.bulkCreate(rows_bulk_gu);

    for (let i = 0; i < cards.length; ++i) {
      rows_bulk_gc.push({
        game_id: game.id,
        user_id: players[0],
        card_id: cards[i].id,
        draw_order: draw_order[i]
      });
    }

    game_cards = await Game_cards.bulkCreate(rows_bulk_gc);

    res.status(200).json({
      status: 200,
      message: "Successfully create a game!",
      game_id: game.id
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: error
    })
  }
  
  // create a game table
 
}