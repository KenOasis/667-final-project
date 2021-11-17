const gameStateDummy = {
  init: (game_state) => {
    gameState = game_state;
  },
  // TODO initial game state with the query result of db
  initFromDb: () => {},
  getGameState: () => {
    return gameState;
  },
};

const DUMMY_GAME_STATE = {
  // this is the game_state hold at the front-end
  cards_deck: 45, // how many cards still in the deck

  game_direction: "clockwise", // game direction

  game_order: [1, 9, 6, 12], // player order, left->right is clockwise, right->left is counter-clockwise

  current_player: 9,

  matching: {
    // matching status for the current turn
    color: "green",
    number: "nine",
  },

  players: [
    {
      // cards of players and whether he/she is in UNO (ready to win ?)
      user_id: 1,
      uno: false,
      // cardds: [1, 22, 84, 12, 47],   // non-current_player could only see the number_of cards
      number_of_cards: 5,
    },
    {
      user_id: 6,
      uno: false,
      // cards: [8, 33, 100, 23, 75, 43],
      number_of_cards: 6,
    },
    {
      user_id: 9,
      uno: false,
      cards: [102, 21, 17, 65, 15, 54],
      number_of_cards: 7,
    },
    {
      user_id: 12,
      uno: true,
      // cards: [6],
      number_of_cards: 1,
    },
  ],

  discards: [94, 25, 28],
  // the most recently discarded cards, the first one is the most recently discarded, is the state that BEFOR action trigger as below if you are not the action performer
};
gameStateDummy.init(DUMMY_GAME_STATE);
module.exports = gameStateDummy;
