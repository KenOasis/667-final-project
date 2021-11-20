/**
 *  This class is used for generate action object
 *  which is returned to the frondend to reflect
 *  the changes of the game state (before and after
 *  the last user action)
 */



//FINISH
const game_state = {
 
  game_id: 2,

  reciever: 9,  // who is recieving this game_state: "who am i", initial game state will be 0;  
  
  cards_deck: 45,    // how many cards still in the deck

  game_direction: 'clockwise', // game direction

  game_order: [1, 9, 6, 12], // player order, left->right is clockwise, right->left is counter-clockwise 

  current_player: 9,
  
  matching: { // matching status for the current turn
    color: "green",
    number:  9,
  },

  players: [{  // plyers card_deck
    user_id: 1,
    uno: false,
    // card_players: [1, 22, 84, 12, 47],   
    // non-current_player could only see the number_of cards
    number_of_cards: 5
  },{
    user_id: 9,
    uno: false,
    card_players: [102, 21, 17, 65, 15, 54, 94],
    number_of_cards: 7
  },{
    user_id: 6,
    uno: false,
    // card_players: [8, 33, 100, 23, 75, 43],
    number_of_cards: 6
  },{
    user_id: 12,
    uno: true,
    // card_players: [6],
    number_of_cards: 1
  }],

  discards: [25, 28, 10]
  // the most recently discarded cards, the first one is the most recently discarded, is the state that BEFOR action trigger as below if you are not the action performer
}
// After this round he play a card 94 

// example
// User 9 (within user's round): Play a card (card_id: 94, green, draw_two, action), then the update state coming back from the backend. the reciever is player: user_id === 6 

// remember, this is the action return to the front end {{{AFTER}}} you send the request to the backend
const update = {
  game_id: 5,
  receiver: 6,
  // the order of action is their performed-order
  actions: [
    {  // action need to perform in front end (caused by )
      performer: 9,
      action_type: "play_card",
      card: [94], 
    }, {
      performer: 6,
      action_type: "draw_two", // draw_two should be include the action which skip user's turn,
      cards: [77, 49] // the card drew from the 
    }]

  // If no challenge happen, after all the action triggered, next player in the order start its own round
}

/**
 * All type of actions
 */

const drawCardAction = {
  // reconnect
  performer: 9,
  type: "draw_card",
  card: [12] // if (is_performer)
}

const playCardAction = {
  performer: 9,
  type = "play_card",
  card: [12]
}

const unoAction = {
  performer: 9,
  type: "uno"
}

const unoPenaltyAction = {
  performer: 9,
  type: "uno_penalty",
  cards: [22,33]
}
const skipAction = {
  performer: 9,
  type: "skip"
} 

const reverseAction = {
  performer: 9,
  type: "reverse"
}

const drawTwoAction = {
  performer: 9,
  type: "draw_two",
  cards: [22, 99] // if (is_performer)
}

// for the wild card (not wild draw four)
const wildAction = {
  performer: 9,
  type: "wild",
  color: "red"
}

// for the 1st step of wild draw four (select color)
const wildDrawFourAction = {
  // reconnecrt
  performer: 9,
  type: "wild_draw_four",
  color: "blue" 
}

// for the 2nd step of wild draw four (challenge)


// example of do not challenge 
const challengeAction = {
  performer: 8,
  type: "challenge",
  is_challenged: false,
  // is_success is not part of this obj
  penalty_player: 8, // who draw the penalty card
  penalty_count: 4, // how many penalty card draw
  penalty_cards: [5, 8, 12, 56] // only if the reciever is the penalty_player 
}

// example of do challenge but failed
const challengeAction = {
  // reconnect
  performer: 8,
  type: "challenge",
  is_challenged: true,
  is_success: false, 
  penalty_player: 8, // who draw the penalty card
  penalty_count: 6, // how many penalty card draw
  penalty_cards: [5, 8, 12, 56, 25, 12] // only if the reciever is the penalty_player  
}

// example of do challenge and success
const challengeAction = {
  performer: 8,
  type: "challenge",
  is_challenged: true,
  is_success: true, // if is_challenge is false, this is not used.
  penalty_player: 5, // who draw the penalty card, at this case is who play the wild draw four
  penalty_count: 4, // how many penalty card draw
  penalty_cards: [5, 8, 12, 56] // only if the reciever is the penalty_player 
}
//  This acts just like the wild card except that the next player also has to draw four cards as well as forfeit his/her turn. With this card, you must have no other alternative cards to play that matches the color of the card previously played. If you play this card illegally, you may be challenged by the next player to show your hand to him/her. If guilty, you need to draw 4 cards. If not, the challenger needs to draw 6 cards instead.

// Regardless of the outcome of challenge, the matching color will be the color which named by the player who played the card.
// legally to play: no other non-wild card which could play for the current matching

// 
// challenge is to challege whether the wild_draw_four is played legally or not.
