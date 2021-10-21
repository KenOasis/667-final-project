const { result } = require('../../db');
const db = require('../../models')
const Games = db['games'];
const Game_users = db['game_users'];
const Game_cards = db['game_cards'];
exports.initialGame = (req, res, next) => {
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

exports.initialGameUsers = (req, res, next) => {
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