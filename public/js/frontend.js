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
        number_of_cards: 5
    }, {
        user_id: 6,
        uno: false,
        // card_players: [8, 33, 100, 23, 75, 43],
        number_of_cards: 6
    }, {
        user_id: 9,
        uno: false,
        card_players: [102, 21, 17, 65, 15, 54],
        number_of_cards: 7
    }, {
        user_id: 12,
        uno: true,
        // card_players: [6],
        number_of_cards: 1
    }],

    discards: [94, 25, 28],
    // the most recently discarded cards, the first one is the most recently discarded, is the state that BEFOR action trigger as below if you are not the action performer
}


// find the state of player by player id
function find_state_player(user_id) {
    const current_player_info = game_state.players.filter(player => player.user_id === user_id);
    return current_player_info;
}

// base one the current -> next -> ... siting them
function sitting_players() {
    const current_player = game_state.current_player;
    let game_order = game_state.game_order;
    const cut = game_order.indexOf(current_player);
    const left = game_order.slice(cut, game_order.lenght);
    const right = game_order.slice(0, cut);
    const table = left.concat(right)
    return table
}

// create a card element by card_id
function card_img_element(card_id) {
    const card_img = document.createElement("img")
    card_img.src = cardModule.card_url_generator(card_id);
    card_img.id = "card_" + card_id.toString();
    card_img.className = "item-hl p-0 rounded showCard";
    return card_img;
}


// create a top player card elements
function opp_card_col_show() {
    const card_img = document.createElement("img")
    card_img.src = "/images/uno_cards/backrow.jpg"
    card_img.className = "item-hl p-0 rounded showColCard";
    return card_img;
}

// create left and right card element
function opp_card_rol_show() {
    const card_img = document.createElement("img")
    card_img.src = "/images/uno_cards/backcol.jpg"
    card_img.className = "item-hl p-0 rounded showCard";
    return card_img;
}

// create the top and bottom card container div and id by player id
function create_parent_col_div(player_id) {
    const div = document.createElement("div")
    div.id = "player_" + player_id.toString();
    div.className = "d-flex justify-content-center flex-column flex-nowrap row-hl";
    return div;
}


// create the left and right card container div and id by player id 
function create_parent_row_div(player_id) {
    const div = document.createElement("div");
    div.id = "player_" + player_id.toString();
    div.className = "d-flex justify-content-center row-hl flex-nowrap";
    return div;
}
// create the player sit position
function get_player_sit() {
    let sitting_order = sitting_players();

    const current_player = document.getElementById("container_bottom")
    const current_bottom = create_parent_row_div(sitting_order[0])
    current_player.appendChild(current_bottom);

    const left_player = document.getElementById("container_left")
    const current_left = create_parent_col_div(sitting_order[1])
    left_player.appendChild(current_left);

    const top_player = document.getElementById("container_top")
    const current_top = create_parent_row_div(sitting_order[2])
    top_player.appendChild(current_top);

    const right_player = document.getElementById("container_right")
    const current_right = create_parent_col_div(sitting_order[3])
    right_player.appendChild(current_right);
}

// read the current player card
function read_current_card(player_id) {
    const player_game_state = find_state_player(player_id)
    const current_div = document.getElementById("player_" + player_id.toString())
    let z_index = 0;
    let left = 0;
    let play_cards_state = player_game_state[0].card_players;
    for (let i in play_cards_state) {
        let img = card_img_element(play_cards_state[i]);
        img.style.zIndex = z_index;
        img.style.left = "-" + left.toString() + "px"
        img.style.border = "3px solid #800000";
        current_div.appendChild(img)
        img.addEventListener('click', function() {
            showWholeCard(play_cards_state[i])
        })
        z_index++;
        left = left + 50;
    }


}
// card click function
function showWholeCard(card_id) {
    const card = document.getElementById("card_" + card_id.toString());
    const card_zIndex = card.style.zIndex;
    if (card_zIndex == 1000) {
        cardRowStyle("player_" + game_state.current_player.toString())
    } else {
        card.style.zIndex = 1000;
        card.style.top = "-30px"
        card.style.border = "3px solid #0000FF"
    }

}

// create other left and right players number of card
function read_opp_card(player_id) {
    const player_game_state = find_state_player(player_id)
    const current_div = document.getElementById("player_" + player_id.toString())
    let z_index = 0;
    let top = 0;
    let number_of_card = player_game_state[0].number_of_cards;
    for (let i = 0; i < number_of_card; i++) {
        let img = opp_card_col_show();
        img.style.zIndex = z_index;
        img.style.top = "-" + top.toString() + "px"
        current_div.appendChild(img)
        z_index++;
        top = top + 50;
    }
}
// create top player # cards
function read_opp_top_card(player_id) {
    const player_game_state = find_state_player(player_id)
    const current_div = document.getElementById("player_" + player_id.toString())
    let z_index = 0;
    let left = 0;
    let number_of_card = player_game_state[0].number_of_cards;
    for (let i = 0; i < number_of_card; i++) {
        let img = opp_card_rol_show();
        img.style.zIndex = z_index;
        img.style.left = "-" + left.toString() + "px"
        current_div.appendChild(img)
        z_index++;
        left = left + 50;
    }
}






// init the game_state to html
function init_game_table() {
    get_player_sit()
    let sitting_order = sitting_players();
    read_current_card(sitting_order[0]);
    read_opp_card(sitting_order[1]);
    read_opp_top_card(sitting_order[2]);
    read_opp_card(sitting_order[3]);
}

init_game_table()

// style use for top and bottom players
let cardRowStyle = (id) => {
    const cardevent = document.getElementById(id);
    const cards = cardevent.querySelectorAll(".showCard");
    let zindex = 0;
    let left = 0;
    for (let i = 0; i < cards.length; i++) {
        let leftstring = "-" + left.toString() + "px";
        cards[i].style.left = leftstring;
        cards[i].style.zIndex = zindex;
        cards[i].style.border = "3px solid #800000";
        cards[i].style.top = "0px";
        zindex++;
        left = 50 + left;
    }

}


// style use for left and right players
let cardColStyle = (id) => {
    const cardevent = document.getElementById(id);
    const cards = cardevent.querySelectorAll(".showColCard");
    let zindex = 0;
    let top = 0;
    for (let i = 0; i < cards.length; i++) {
        let topstring = "-" + top.toString() + "px";
        cards[i].style.top = topstring;
        cards[i].style.zIndex = zindex;
        zindex++;
        top = 50 + top;
    }

}



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