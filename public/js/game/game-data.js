
// fetch game_state
function game_init() {
    const url = "http://" + location.host + "/game/game_state";
    fetch(url)
        .then(response => response.json())
        .then(results => {
            const game_state = results.game_state;
            const game_helper = new game_state_helper(game_state);
            game_helper.game_init();
            game_helper.show_discard();
        }
        )
        .catch(err => console.log(err))
}


// adding event to card
const game_state = {  // this is the game_state hold at the front-end
    game_id : 1,

    cards_deck: 45,    // how many cards still in the deck

    receiver: 9,
  
    game_direction: 'clockwise', // game direction
  
    game_order: [1, 9, 6, 12], // player order, left->right is clockwise, right->left is counter-clockwise 
  
    current_player: 9,
    
    matching: { // matching status for the current turn
      color: "green",
      number:  "nine",
    },
  
    players: [{  // cards of players and whether he/she is in UNO (ready to win ?)
      user_id: 1,
      uno: false,
      // card_players: [1, 22, 84, 12, 47],   // non-current_player could only see the number_of cards
      number_of_cards: 5
    },{
      user_id: 6,
      uno: false,
      // card_players: [8, 33, 100, 23, 75, 43],
      number_of_cards: 6
    },{
      user_id: 9,
      uno: false,
      cards: [102, 21, 17, 65, 15, 54,70],
      number_of_cards: 7
    },{
      user_id: 12,
      uno: true,
      // card_players: [6],
      number_of_cards: 1
    }],
  
    discards: [94, 25, 28], 
    // the most recently discarded cards, the first one is the most recently discarded, is the state that BEFOR action trigger as below if you are not the action performer
  }


  const game_helper = new game_state_helper(game_state);
  game_helper.set_players_location()
  game_helper.set_game_state_to_page()