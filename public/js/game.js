const game_state = { // this is the game_state hold at the front-end
    cards_deck: 45, // how many cards still in the deck

    game_direction: 'clockwise', // game direction

    game_order: [1, 9, 6, 12], // player order, left->right is clockwise, right->left is counter-clockwise 

    current_player: 9,

    matching: { // matching status for the current turn
        color: "green",
        number: 9,
    },

    players: [{ // cards of players and whether he/she is in UNO (ready to win ?)
            user_id: 1,
            uno: false,
            card_players: [1, 22, 84, 12, 47],   // non-current_player could only see the number_of cards
            number_of_cards: 7
        }, {
            user_id: 6,
            uno: false,
            card_players: [8, 33, 100, 23, 75, 43],
            number_of_cards: 7
        }, {
            user_id: 9,
            uno: false,
            card_players: [108, 1, 22, 3, 4, 5, 6],
            number_of_cards: 7
        },
        {
            user_id: 12,
            uno: true,
            card_players: [6],
            number_of_cards: 7
        }
    ],

    discards: [9, 12, 4, 56],
    // the most recently discarded cards, the first one is the most recently discarded, is the state that BEFOR action trigger as below if you are not the action performer
}
const top_player = document.getElementById("top-player");
const left_player = document.getElementById("left-player");
const right_player = document.getElementById("right-player");
const main_player = document.getElementById("main-player");
console.log(cardModule);