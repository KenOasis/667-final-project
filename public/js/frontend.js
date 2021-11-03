const simple_game_state = {
    current_color: "green",
    current_player: {
        player_id: 9,
        cards: [80, 90, 100, 22]
    },
    player_b: {
        player_id: 10,
        card_num: 4
    },
    player_c: {
        player_id: 11,
        card_num: 6
    },
    player_d: {
        player_id: 12,
        card_num: 7
    }
}

function card_img_element(card_id) {
    const card_img = document.createElement("img")
    card_img.src = cardModule.card_url_generator(card_id);
    card_img.id = "card_" + card_id.toString();
    card_img.className = "item-hl p-0 rounded showCard";
    // card_img.addEventListener("click", showWholeCard(card_id))
    return card_img;
}

// function showWholeCard(card_id) {
//     const card = document.getElementById("card_" + card_id.toString());
//     const div = simple_game_state.current_player.player_id;
//     const current_cards = "player_" + div.toString();
//     if (card_zIndex == 1000) {
//         cardRowStyle(current_cards)
//     } else {
//         card.style.zIndex = 1000;
//         card.style.top = "-30px"
//         card.style.border = "3px solid #0000FF"
//     }
// }



function opp_card_col_show() {
    const card_img = document.createElement("img")
    card_img.src = "/images/uno_cards/backcol.jpg"
    card_img.className = "item-hl p-0 rounded showColCard";
    return card_img;
}

function opp_card_rol_show() {
    const card_img = document.createElement("img")
    card_img.src = "/images/uno_cards/backrow.jpg"
    card_img.className = "item-hl p-0 rounded showCard";
    return card_img;
}

function create_parent_col_div(player_id) {
    const div = document.createElement("div")
    div.id = "player_" + player_id.toString();
    div.className = "d-flex justify-content-center flex-column flex-nowrap row-hl";
    return div;
}

function create_parent_row_div(player_id) {
    const div = document.createElement("div");
    div.id = "player_" + player_id.toString();
    div.className = "d-flex justify-content-center row-hl flex-nowrap";
    return div;
}


function read_game_state(simple_game_state) {
    let current_player = simple_game_state.current_player.player_id;
    let current_div = document.getElementById("current_player");
    let div = create_parent_row_div(current_player);
    let player_card = simple_game_state.current_player.cards;

    for (let i in player_card) {
        let img = card_img_element(player_card[i]);
        console.log(img.)
        div.appendChild(img)
    }
    current_div.appendChild(div);
    cardRowStyle(div);
    return current_div;
}

console.log(read_game_state(simple_game_state))



let cardRowStyle = (div) => {
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
    // let cardColStyle = (id) => {
    //     const cardevent = document.getElementById(id);
    //     const cards = cardevent.querySelectorAll(".showColCard");
    //     let zindex = 0;
    //     let top = 0;
    //     for (let i = 0; i < cards.length; i++) {
    //         let topstring = "-" + top.toString() + "px";
    //         cards[i].style.top = topstring;
    //         cards[i].style.zIndex = zindex;
    //         zindex++;
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