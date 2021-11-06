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
            // card_players: [1, 22, 84, 12, 47],   // non-current_player could only see the number_of cards
            number_of_cards: 7
        }, {
            user_id: 6,
            uno: false,
            // card_players: [8, 33, 100, 23, 75, 43],
            number_of_cards: 7
        }, {
            user_id: 9,
            uno: false,
            card_players: [8, 1, 22, 3, 4, 5, 6],
            number_of_cards: 7
        },
        {
            user_id: 12,
            uno: true,
            // card_players: [6],
            number_of_cards: 7
        }
    ],

    discards: [94, 25, 28],
    // the most recently discarded cards, the first one is the most recently discarded, is the state that BEFOR action trigger as below if you are not the action performer
}


/**
 *  fund_state_player is used for get the player cards detail information
 * in game_state {playsers[]}
 * example:
 * find_state_player(7)
 * return: Array
 * [{
 *    user_id: 9,
 *    uno: false,
 *    card_players: [8, 1, 22, 3, 4, 5, 6],
 *    number_of_cards: 7
 * }]
 * 
 */
function find_state_player(user_id) {
    const current_player_info = game_state.players.filter(player => player.user_id === user_id);
    return current_player_info;
}


/**
 * sitting_player() is used for setting the sit for player by 
 * game_order in game state
 * example
 * here game_order = [1, 9, 6, 12]
 * current_player =  9
 * sitting_players()  
 * 
 * return: Array [9,6,12,1]
 * 
 * the first number of array should awalys current order
 */
function sitting_players() {
    const current_player = game_state.current_player;
    let game_order = game_state.game_order;
    const cut = game_order.indexOf(current_player);
    const left = game_order.slice(cut, game_order.lenght);
    const right = game_order.slice(0, cut);
    const table = left.concat(right)
    return table
}


/**
 * create_img_element(card_id) is used to create the current player cards html element
 * example:
 * card_img_element(7)
 * return:
 * <li id="card_7" class="list-group-item p-2"><img src="/images/uno_cards/number-yellow-1.jpg" id="7" class="showCard"></li>
 * event “click” also will be adding in image
 */

function card_img_element(card_id) {
    const li = document.createElement('li');
    li.id = "card_" + card_id.toString();
    li.className = "list-group-item p-2";
    const card_img = document.createElement("img")
    card_img.src = cardModule.card_url_generator(card_id);
    card_img.id = card_id;
    card_img.className = "showCard";
    card_img.addEventListener('click', function() {
        showWholeCard(card_id);
    })
    li.appendChild(card_img)
    return li;
}
/**
 * showWholdCard(card_id) is used for click event
 * first click => card_li_element will show the whole cards and up
 * second click on same card => back to the line
 *
 */

function showWholeCard(card_id) {
    const card = document.getElementById("card_" + card_id.toString());
    const card_zIndex = card.style.zIndex;
    if (card_zIndex == 1000) {
        card.style.zIndex = 0;
        card.style.top = 0;
        card.style.border = 0;
        // cardRowStyle("player_" + game_state.current_player.toString())
    } else {
        card.style.zIndex = 1000;
        card.style.top = "-30px"
        card.style.border = "3px solid #0000FF"
    }

}
/**
 * create_img_element() is create the backside card in html element
 * it should be userd in left player and right player
 * example:
 * opp_card_rol_show() 
 * return:
 * <li class="list-group-item p-2"><img src=""/images/uno_cards/backrow.jpg"" class="showColCard"></li>
 * 
 */

function opp_card_col_show() {
    const li = document.createElement('li');
    li.className = "list-group-item p-2";
    const card_img = document.createElement("img")
    card_img.src = "/images/uno_cards/backrow.jpg"
    card_img.className = "showColCard";
    li.appendChild(card_img)
    return li;
}
/**
 * create_img_element() is create the backside card in html element
 * it should be userd in left player and right player
 * example:
 * card_img_element()
 * return:
 * <li class="list-group-item p-2"><img src=""/images/uno_cards/backrow.jpg"" class="showColCard"></li>
 * 
 */
function opp_card_rol_show() {
    const li = document.createElement('li');
    li.className = "list-group-item p-2";
    const card_img = document.createElement("img")
    card_img.src = "/images/uno_cards/backcol.jpg"
    card_img.className = "showCard";
    li.appendChild(card_img)
    return li;
}

/**
 * create_parent_col_div() is usered create the container to player's cards in html element
 * by player_id
 * it should be used to store left player's cards and right player's cards
 * 
 * example:
 * create_parent_col_div(7)
 * return:
 * <ul id="player_7" class="list_group"> </ul> 
 * 
 */

function create_parent_col_div(player_id) {
    const ul = document.createElement("ul");
    ul.id = "player_" + player_id.toString();
    ul.className = "list-group";
    return ul;
}




/**
 * create_parent_row_div(player_id) is usered create the container to player's cards in html/pug element
 * by player_id
 * it should be used to store top player's cards and bottom player's cards
 * 
 * example:
 * create_parent_col_div(7)
 * return:
 * like
 * <ul id="player_7" class="list-group list-group-horizontal"> </ul> 
 * 
 */

function create_parent_row_div(player_id) {
    const ul = document.createElement("ul");
    ul.id = "player_" + player_id.toString();
    ul.className = "list-group list-group-horizontal";
    return ul;
}
/**
 * get_player_sit()  is used to sit down 4 players to their positions 
 * and set up their cards containers to html/pug
 * 
 */
function get_player_sit() {
    let sitting_order = sitting_players();

    const current_player = document.getElementById("container_bottom");
    const current_bottom = create_parent_row_div(sitting_order[0]);
    current_player.appendChild(current_bottom);

    const left_player = document.getElementById("container_left");
    const current_left = create_parent_col_div(sitting_order[1]);
    left_player.appendChild(current_left);

    const top_player = document.getElementById("container_top");
    const current_top = create_parent_row_div(sitting_order[2]);
    top_player.appendChild(current_top);

    const right_player = document.getElementById("container_right");
    const current_right = create_parent_col_div(sitting_order[3]);
    right_player.appendChild(current_right);
}

/**
 * read_current_card(player_id) is used to add the card to current
 * player's container
 * 
 * siting the player and seting up card container before using the function
 * 
 */
function read_current_card(player_id) {
    const player_game_state = find_state_player(player_id)
    const current_div = document.getElementById("player_" + player_id.toString())
    let left = 0;
    let play_cards_state = player_game_state[0].card_players;
    for (let i in play_cards_state) {
        let img = card_img_element(play_cards_state[i]);
        img.style.left = "-" + left.toString() + "px"
        current_div.appendChild(img);
        left = left + 50;
    }
}
/**
 * read_opp_card(player_id) is used to add the card to left and right
 * player's container
 * 
 * siting the player and seting up card container before using the function
 * 
 */
function read_opp_card(player_id) {
    const player_game_state = find_state_player(player_id)
    const current_div = document.getElementById("player_" + player_id.toString())
    let top = 0;
    let number_of_card = player_game_state[0].number_of_cards;
    for (let i = 0; i < number_of_card; i++) {
        let img = opp_card_col_show();
        img.style.top = "-" + top.toString() + "px"
        current_div.appendChild(img)
        top = top + 65;
    }
}
/**
 * read_current_card(player_id) is used to add the card to top
 * player's container
 * 
 * before using the function, using get_player_sit() first
 * 
 */
function read_opp_top_card(player_id) {
    const player_game_state = find_state_player(player_id)
    const current_div = document.getElementById("player_" + player_id.toString())
    let left = 0;
    let number_of_card = player_game_state[0].number_of_cards;
    for (let i = 0; i < number_of_card; i++) {
        let img = opp_card_rol_show();
        img.style.left = left.toString() + "px"
        current_div.appendChild(img)
        left = left - 50;
    }
}


/**
 * init_game_table(player_id) is used to adding the players element in
 * game_state, when they init the game
 * 
 * still working on discard pile  init setup
 * 
 * 
 * 
 */
function init_game_table() {
    get_player_sit()
    let sitting_order = sitting_players();
    read_current_card(sitting_order[0]);
    read_opp_card(sitting_order[1]);
    read_opp_top_card(sitting_order[2]);
    read_opp_card(sitting_order[3]);
}

init_game_table()

//Todo: To solve when player  7< cards < 30 or 20 , these cards can be keep in the blue border
//Todo: To show the discard pile  in  div(class="col-md-6" id="discard_pile") /random_cards.pug
//Todo: To show the chat box in left side of 
//Todo: To show the players avatar
//Todo: show the cards_desk, may but put the backside card img as cards_desk on some space, idk
/**
 * Todo: To create the game control bottoms
 * button 1: Uno
 * Uno button show be show in the right side of current player
 * 
 * button 2: draw card
 * draw_card button show be show in the right side of current player
 * 
 * button 3: play
 * My idea is when clicked card that can be play, play button will show up
 * Need using the game_state.matching 
 *  
 */

const update = {
    game_id: 5,
    user_id: 6,
    // the order of action is their performed-order
    actions: [{ // action need to perform in front end (caused by )
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




/**
 * Todo: add events
 * 
 * use endpoint to request 
 * 
 * I think we may need to use socket.io to react the backend socketio. Idk
 * 1. play_card(event) send  card id to backend and      
 * ---requirement: card must be playable, same color or  same number or wild card
 * ---response:  {
 *   performer: performer_id,
 *   card: card_id, 
 *   action_type: "play_card"
 * }
 * --- update to response to the frontend game_state and card_id to discard_pile
 * we may need to write some utilty functions to update the game state
 * playcard(??)
 * drawcard(??)
 * update_matching(??)
 * discards(??)
 *      
 * 2. draw_card(event) send player_id to backend
 * ---- request: send userid ?
 * 
 * --- response:   
 * {
 *  performer: performer_id,
 *   action_type: "draw_card",
 *   card: card_id
 * }
 *or
 *{
 *  performer: performer_id,
 *  action_type: "draw_card"
 *}
 * update the response to frontend game_state and web page
 * 
 * 
 * 3. wild_card: 
 *      1. ask the player to chose color
 *      2. send color, wild_card_id, and player_id to backend
 *      3. update frontend game_state and user 
 *  ---response: 
 * 
 * 
 * still working on event things
 * 
 * 
 */


// below functions are my testing funtions

// let cardRowStyle = (id) => {
//     const cardevent = document.getElementById(id);
//     const cards = cardevent.getElementsByClassName("list-group-item")
//     let left = 0;
//     for (let i = 0; i < cards.length; i++) {
//         let leftstring = "-" + left.toString() + "px";
//         cards[i].style.left = leftstring;
//         left = 50 + left;
//     }

// }


// // style use for left and right players
// let cardColStyle = (id) => {
//     const cardevent = document.getElementById(id);
//     const cards = cardevent.querySelectorAll(".showColCard");
//     let top = 0;
//     for (let i = 0; i < cards.length; i++) {
//         let topstring = "-" + top.toString() + "px";
//         cards[i].style.top = topstring;
//         cards[i].style.zIndex = zindex;
//         top = 50 + top;
//     }

// }



// function cardSelectChecker() {
//     const cardevent = document.getElementById("card_container");
//     const cards = cardevent.querySelectorAll(".showCard");
//     let checker = 0;
//     for (let i = 0; i < cards.length; i++) {
//         if (cards[i].style.border === "3px solid rgb(0, 0, 255)") {
//             checker++;
//         }
//     }
//     return checker;

// }
// let cardid = 0;

// function discard_pile(element) {
//     let img = document.createElement("img")
//     img.src = element.getAttribute("src");
//     img.id = cardid;
//     img.className = "rounded showCard";
//     img.style.cssText = "position: relative; bottom: -30px "

//     let discard = document.getElementById("discard_pile");
//     console.log(img);
//     discard.appendChild(img);
//     console.log(discard);

// }

// function playCard(event) {
//     event.preventDefault();
//     const checker = cardSelectChecker();
//     if (checker === 1) {
//         const cardData = document.getElementById(cardid);
//         discard_pile(cardData);
//         cardData.remove();
//         cardRowStyle("card_container")
//             // let cardData=new Request("",{
//             //     method:"post",
//             //     headers:{
//             //         'Content-Type': 'application/json;charset=utf-8;'
//             //     },
//             //     body: JSON.stringify({card_id: cardid, userid: userid})

//         // })
//         console.log(cardid);
//     } else {
//         const message = "please select one card";
//         addFlashFromFrontEnd(message);
//     }
// }

// let getResult = (request) => {
//     fetch(request)
//         .then(response => {
//             return "result"
//         })

//