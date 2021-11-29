const game_state = { // this is the game_state hold at the front-end
    cards_deck: 45, // how many cards still in the deck

const simple_game_state = {
  current_play: 9,
  current_color: "green",
  player_a: {
    player_id: 9,
    cards: [80, 90, 100, 22],
  },
  player_b: {
    player_id: 10,
    cards: [80, 90, 100, 22],
  },
  player_c: {
    player_id: 11,
    cards: [80, 90, 100, 22],
  },
  player_d: {
    player_id: 12,
    cards: [80, 90, 100, 22],
  },
};

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
  const card_img = document.createElement("img");
  card_img.src = cardmodule.card_url_generator(card_id);
  card_img.id = card_id;
  card_img.className = "item-hl p-0 rounded showCard";
  return card_img;
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
        img.style.left = left.toString() + "px";
        current_div.appendChild(img);
        left = left - 40;
    }

}

function place_discard_pile() {
    const discard_pile = document.getElementById("discard_pile")
    let discard_list = game_state.discards;
    console.log(discard_list)
    let left = 0;
    if (discard_list.length > 3) {
        const last_three = discard_list.length - 3;
        discard_list = discard_list.slice(last_three, discard_list.length);
    }
    console.log(discard_list)
    for (let i in discard_list) {
        let discard = card_img_element(discard_list[i])
        discard.id = "draw"
        discard.style.left = "-" + left.toString() + "px";
        discard_pile.appendChild(discard)
        left = left + 50
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
    place_discard_pile()
}






init_game_table()

function opp_card_show() {}

function add_card_to_current_player(player_id, card_list) {
    const card_container = document.getElementById("player_" + player_id.toString())
    for (let i in card_list) {
        const new_card = card_img_element(card_list[i]);
        card_container.appendChild(new_card);
    }
    card_current_Style(player_id);
}
/**
 * 
 * this function user for when any action or event happend, using this function 
 * to style the current player's card again
 * 
 * 
 * 
 */
let card_current_Style = (id) => {
    const cardevent = document.getElementById("player_" + id.toString());
    const cards = cardevent.getElementsByClassName("list-group-item")
    let incremnt = 0;
    let left = 0;
    let number_cards = cards.length;
    let rotate_left = 0;
    let rotate_right = 0;
    let rotate_imcrement = 0;
    let top_left = 0;
    let top_right = 0
    let top_imcrement = 0;
    const divide = Math.round(number_cards / 2);
    if (number_cards <= 7) {
        incremnt = 40;
    } else if (number_cards < 10) {
        incremnt = 50;
    } else if (number_cards <= 15) {
        incremnt = 60;
        rotate_left = 60;
        rotate_right = rotate_left / divide;
        rotate_imcrement = rotate_left / divide;
        top_imcrement = 5;
        top_right = 5 * divide - 5;
    } else {
        incremnt = 75;
        rotate_left = 60;
        rotate_right = rotate_left / divide;
        rotate_imcrement = rotate_left / divide;
        top_imcrement = 5;
        top_right = 5 * divide - 5;
    }
    for (let i = 0; i < number_cards; i++) {
        let leftstring = "-" + left.toString() + "px";
        cards[i].style.left = leftstring;
        if (i < divide) {
            cards[i].style.transform = "rotate(-" + rotate_left + "deg)";
            cards[i].style.top = "-" + top_left.toString() + "px";
            top_left = top_left + top_imcrement;
            rotate_left = rotate_left - rotate_right;
        } else {
            cards[i].style.transform = "rotate( " + rotate_right + "deg)";
            cards[i].style.top = "-" + top_right.toString() + "px";
            rotate_right = rotate_right + rotate_imcrement;
            top_right = top_right - top_imcrement;
        }
        left = incremnt + left;
    }

}

/**
 * 
 * this function user for when any action or event happend, using this function 
 * to style the left and right player's card again
 * 
 * only can handle the card container has less than 20
 */


let card_col_style = (id) => {
    const cardevent = document.getElementById("player_" + id.toString());
    const cards = cardevent.getElementsByClassName("list-group-item");
    let top = 0;
    let increment = 0;
    let number_card = cards.length;
    if (number_card < 7) {
        increment = 40;
    } else if (number_card <= 10) {
        increment = 55;
    } else if (number_card <= 15) {
        increment = 60
    } else {
        increment = 75
    }

    for (let i = 0; i < cards.length; i++) {
        let topstring = "-" + top.toString() + "px";
        cards[i].style.top = topstring;
        top = increment + top;
    }

}

/**
 * 
 * this function user for when any action or event happend, using this function 
 * to style the top player's card again
 * 
 * only can handle the card container has less than 20
 * 
 */


let card_top_style = () => {
    const cardevent = document.getElementById("container_top");
    const cards = cardevent.getElementsByClassName("list-group-item");
    console.log(cards)
    let left = 0;
    let increment = 0;
    let number_card = cards.length;
    if (number_card <= 7) {
        increment = 40;
    } else if (number_card <= 10) {
        increment = 52;
    } else if (number_card <= 15) {
        increment = 66
    } else {
        increment = 76
    }

    for (let i = 0; i < cards.length; i++) {
        cards[i].style.left = "-" + left.toString() + "px";
        left = increment + left;
    }

}


/**
 * testing function:
 * may be we use the way to add card to left right 
 * 
 * 
 * 
 */

// function add_card_to_left_right(player_id, number_of_card) {

//     const card_container = document.getElementById("player_" + player_id.toString());
//     for (let i = 0; i < number_of_card; i++) {
//         const cards = opp_card_col_show()
//         card_container.appendChild(cards)
//     }
//     card_col_style(player_id);
// }
// add_card_to_left_right(6, 2)


//Todo: To show the chat box in left side of current player space7
//Todo: To show the players avatar
//Todo: this js script file is too long, make one more
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

//update example??
// const update = {
//     game_id: 5,
//     user_id: 6,
//     // the order of action is their performed-order
//     actions: [{ // action need to perform in front end (caused by )
//         performer: 9,
//         action_type: "play_card",
//         card: 94,
//     }, {
//         performer: 6,
//         action_type: "draw_two", // draw_two should be include the action which skip user's turn,
//         cards: [77, 49] // the card drew from the 
//     }]

//     // If no challenge happen, after all the action triggered, next player in the order start its own round
// }





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

// }

// cardRowStyle("card_container")
// cardRowStyle("player1")
// cardColStyle("player2")
// cardColStyle("player3")
