const cardmodule = require("./card");


const simple_game_state = {
    current_play: 9,
    current_color: "green",
    player_a: {
        player_id: 9,
        cards: [80, 90, 100, 22]
    },
    player_b: {
        player_id: 10,
        cards: [80, 90, 100, 22]
    },
    player_c: {
        player_id: 11,
        cards: [80, 90, 100, 22]
    },
    player_d: {
        player_id: 12,
        cards: [80, 90, 100, 22]
    }
}

function card_img_element(card_id) {
    const card_img = document.createElement("img")
    card_img.src = cardmodule.card_url_generator(card_id);
    card_img.id = card_id;
    card_img.className = "item-hl p-0 rounded showCard";
    return card_img;

}

function opp_card_show() {


}




// let cardRowStyle = (id) => {
//     console.log(id)
//     const cardevent = document.getElementById(id);
//     const cards = cardevent.querySelectorAll(".showCard");
//     let zindex = 0;
//     let left = 0;
//     for (let i = 0; i < cards.length; i++) {
//         let leftstring = "-" + left.toString() + "px";
//         cards[i].style.left = leftstring;
//         cards[i].style.zIndex = zindex;
//         cards[i].style.border = "3px solid #800000";
//         cards[i].style.top = "0px";
//         zindex++;
//         left = 50 + left;
//     }

// }
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

// function showWholeCard(event) {
//     event.preventDefault();
//     cardid = event.target.id;
//     const card = document.getElementById(cardid);
//     const card_zIndex = card.style.zIndex;
//     if (card_zIndex == 1000) {
//         cardRowStyle("card_container")
//         console.log(card.style.zIndex);
//         cardid = 0;
//     } else {
//         card.style.zIndex = 1000;
//         card.style.top = "-30px"
//         card.style.border = "3px solid #0000FF"
//     }
//     console.log("checker")
//     console.log(cardSelectChecker("card_container"));
// }

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