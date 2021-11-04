/*
  this helper classs use to generate the action object for the update.actions (see below) to update the
  game_state of the frontend (and backend?)
*/




const game_state = {  // this is the game_state hold at the front-end
  cards_deck: 45,    // how many cards still in the deck

  game_direction: 'clockwise', // game direction

  game_order: [1, 9, 6, 12], // player order, left->right is clockwise, right->left is counter-clockwise 

  current_player: 9,
  
  matching: { // matching status for the current turn
    color: "green",
    number:  9,
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
    card_players: [102, 21, 17, 65, 15, 54],
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

// example
// Then this is user 9 (within user's round): Play a card (card_id: 94, green, draw_two, action), then the update state coming back from the backend. the reciever is player: user_id === 6 

// remember, this is the action trigger {{{AFTER}}} you send the request to the backend
const update = {
  game_id: 5,
  user_id: 6,
  // the order of action is their performed-order
  actions: [
    {  // action need to perform in front end (caused by )
      performer: 9,
      action_type: "play_card",
      card: 94, 
    }, {
      performer: 6,
      action_type: "draw_two", // draw_two should be include the action which skip user's turn,
      cards: [77, 49] // the card drew from the 
    }]

  // If no challenge happen, after all the action triggered, next player in the order start its own round
}




/*
Response action object for drawcard action
@parameter
  performer_id(int): action performer's id
  card_id(int): card in the action
  is_performer(boolean): whether this action sended to the performer
@return (object)
  IF is_performer === true:
  {
    performer: performer_id,
    action_type: "draw_card",
    card: card_id
  }
  ELSE: 
  {
    performer: performer_id,
    action_type: "draw_card"
  }
*/
exports.drawCard = (performer_id, card_id, is_performer) => {
  const action = {};
  action.performer = performer_id;
  action.action_type = "draw_card";
  if (is_performer === true) {
    action.card_id = card_id
  }
  return action;
}

/*
Response action object for playcard action
This action is ONLY sent to the NON-CURRENT user
@parameter
  performer_id(int): action performer's id
  card_id(int): card in the action
@return (object)
  {
    performer: performer_id,
    card: card_id,
    action_type: "play_card"
  }
*/
exports.playCard = (performer_id, card_id) => {
  const action = {};
  action.performer = performer_id;
  action.action_type = "play_card";
  action.card = card_id;
  return action;
}

/*
Response action object for calling uno action
@parameter
  performer_id(int): action performer's id
  card_id(int): card in the action
  is_performer(boolean): whether this action sended to the performer
@return (object)
  {
    performer: performer_id,
    action_type: "draw_card",
  }
*/
exports.uno = (performer_id) => {
  const action = {}
  action.performer = performer_id;
  action.action_type = "uno";
  return action;
}
/*
// Response action object for action skip
@parameter
  performer_id(int): action performer's id
@return (object)
  {
    performer: performer_id,
    action_type: "skip"
  }
*/

exports.skip = (performer_id) => {
  const action = {};
  action.performer = performer_id;
  action.action_type = "skip";
  return action;
}

/*
// Response action object for action reverse
@parameter
  performer_id(int): action performer's id
@return (object)
  {
    performer: performer_id,
    action_type: "reverse"
  }
*/
exports.reverse = (performer_id) => {
  const action = {};
  action.performer = performer_id;
  action.action_type = "reverse";
  return action;
}

/*
Response action object for drawtwo action
@parameter
  performer_id(int): action performer's id
  cards([int]): an array with two card_id represent two cards draw from deck, example: [22, 82]; 
  is_performer(boolean): whether this action sended to the performer
@return (object)
  IF is_performer === true:
  {
    performer: performer_id,
    action_type: "draw_two",
    cards: cards
  }
  ELSE: 
  {
    performer: performer_id,
    action_type: "draw_two"
  }
*/
exports.drawTwo = (performer_id, cards, is_performer) => {
  const action = {};
  action.performer = performer_id;
  action.action_type = "draw_two";
  if (is_performer === true) {
    action.cards = cards;
  }
  return action;
}

/*
// Response action object for action wild
@parameter
  performer_id(int): action performer's id
  color(str): the selected wild color
@return (object)
  {
    performer: performer_id,
    color: color,
    action_type: "wild"
  }
*/
exports.wild = (performer_id, color) => {
  const action = {};
  action.performer = performer_id;
  action.action_type = "wild";
  action.color = color;
  return action;
}

/*
Response action object for challenge action for played wild_draw_four
from the current player(performer).  It represent the next-player is triggering the
challenge process;

@parameter
  performer_id(int): action performer's id
@return: (object)
  {
    performer: performer_id,
    action_type: "wild",
  }
*/

exports.challenge = (performer_id) => {
  const action = {};
  action.performer = performer_id;
  action.action_type = "challenge";
  return action;
}


/*
Response action object for result action for played wild_draw_four
it will trigger the animation of the results (whether the next-player accept the challenge, if yes then what color selected for challege);
@parameter
  performer_id(int): action performer's id
  is_challenged(boolean): whether next-player try to do challenge
  is_succeed(boolean): whehter the chanllege is succedd (if is_challenge is true; otherwise it will be undefined) 
  color: the color which next-player selected (if is_challenged is true; otherwise it will be undefined)
  number_of_cards(int): the number of the cards which performer will draw;
  cards([int]): the array contain the cards drawn
  is_performer(boolean): whether this action is sended to performer
@return (object)
  IF is_challenge === true
    IF(is_performer === true)  
    {
      performer: performer_id,
      number_of_cards: number_of_cards,
      color: color,
      cards: cards,                        
      is_challenged: is_challenged,
      is_succeed: is_succeed,
    }
    ELSE
    {
      performer: performer_id,
      number_of_cards: number_of_cards,
      color: color,                     
      is_challenged: is_challenged,
      is_succeed: is_succeed,
    }
  ELSE
    IF(is_performer === true)
    {
      performer: performer_id,
      number_of_cards: number_of_cards,
      cards: cards,                        
      is_challenged: is_challenged,
    }
    ELSE
    {
      performer: performer_id,
      number_of_cards: number_of_cards,                    
      is_challenged: is_challenged,
    }
    
*/
exports.wildDrawFour = (performer_id, number_of_cards, is_challenged, is_succeed, cards, is_performer) => {
  const action = {};
  action.performer = performer_id;
  action.number_of_cards = number_of_cards;
  action.action_type = "wild_draw_four";
  if (is_performer) {
    action.cards = cards;
  }
  if (is_challenged) {
    action.is_challenged = is_challenged;
    action.is_succeed = is_succeed;
  }
  return action 
}


