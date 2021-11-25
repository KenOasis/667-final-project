let card_tool = {
  // sit player to html
  sit_player(player_id, contianer_id) {
    const leftseat = document.getElementById(contianer_id);
    const div = document.createElement("div");
    const position = contianer_id.replace(/container_/g, "");
    div.className = "hand";
    div.id = "player_" + player_id.toString();
    div.setAttribute("position", position);
    leftseat.appendChild(div);
  },
  // set the card div with card_id // style is normal and discard
  set_cards(card_id, style = "normal") {
    const card = document.createElement("div");
    // CardModule from card.js
    const card_detail = CardModule.get_card_detail(card_id);
    if (style == "normal") {
      card.id = "card_" + card_id.toString();
    }
    if (card_detail.card_color === "none") {
      card.className = " card " + card_detail.card_value;
    } else {
      card.className =
        " card " + card_detail.card_color + " " + card_detail.card_value;
    }
    return card;
  },
  // set card_back div
  set_card_back(card_back) {
    const card = document.createElement("div");
    if (card_back == "back") {
      card.className = "card " + card_back;
    } else {
      card.className = card_back;
    }
    return card;
  },
  // put card to player's container
  card_to_player(player_id, card) {
    const div = document.getElementById("player_" + player_id.toString());
    div.appendChild(card);
  },
  check_clicked_card(player_id) {
    const player = document.getElementById("player_" + player_id.toString());
    const cards = player.getElementsByClassName("card");
    let count = 0;
    let card_id = "";
    let match;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (card.style.top == "-25px") {
        count++;
        card_id = card.id;
        match = card.getAttribute("matching");
      }
    }
    const id = parseInt(card_id.replace(/card_/g, ""));
    let is_wild_card = false;
    if (count === 1) {
      // CardModule from card.js
      is_wild_card = CardModule.get_card_detail(id).card_color === "none";
    }
    const clicked_one = count === 1;
    const matching = match === "True";
    if (matching && clicked_one) {
      //page_effect fron page_effect
      page_effect.show_play_button(is_wild_card);
    } else {
      //page_effect fron page_effect
      page_effect.hide_play_button();
    }
    let obj = {
      clicked_card: count,
      card_id: id,
      matching: match,
    };
    console.log(obj);
    return obj;
  },
};
