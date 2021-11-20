/**
 * This file is used to create the card to html
 * and init the game_state to html
 *
 */
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
  // set the card div with card_id
  set_cards(card_id, style = "normal") {
    const card = document.createElement("div");
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
  show_play_button() {
    const play = document.getElementById("play");
    play.style.zIndex = 4;
  },
  hide_play_button() {
    const play = document.getElementById("play");
    play.style.zIndex = 0;
  },
  check_clicked_card(player_id) {
    const player = document.getElementById("player_" + player_id.toString());
    const cards = player.getElementsByClassName("card");
    let count = 0;
    let card_id = "";
    let matching;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (card.style.top == "-25px") {
        count++;
        card_id = card.id;
        matching = card.getAttribute("matching");
      }
    }
    const id = parseInt(card_id.replace(/card_/g, ""));
    let obj = {
      clicked_card: count,
      card_id: id,
      matching: matching,
    };

    return obj;
  },
  highlight_current(player_id) {
    const user = document.getElementById("user_" + player_id.toString());
    const avater = user.getElementsByClassName("avater")[0];
    avater.style.border = "4px solid #FF0000";
    avater.style.borderRadius = "15px";
  },
  set_game_direction(direction, color) {
    const element = document.createElement("i");
    element.id = "game_direction";
    element.style.color = color;
    if (direction == 1) {
      element.className = "bi bi-arrow-clockwise fs-1";
    } else {
      element.className = "bi bi-arrow-counterclockwise fs-1";
    }
    const parent = document.getElementById("match_direction");
    parent.appendChild(element);
  },
};

let player_controller = {
  whoima() {
    let buttom_player = document.getElementById("container_bottom");
    let container = buttom_player.getElementsByClassName("hand")[0];
    const id = parseInt(container.id.replace(/player_/g, ""));
    return id;
  },
};

let action_util = {
  add_card_event(card_list) {
    const player_id = player_controller.whoima();
    return new Promise((resolve) => {
      for (let i = 0; i < card_list.length; i++) {
        setTimeout(function () {
          const card_html = card_tool.set_cards(card_list[i]);
          card_tool.card_to_player(player_id, card_html);
        }, i * 200);
      }
      setTimeout(resolve, card_list.length * 300, "done");
    });
  },
  add_card_back_event(number_cards, card_type, player_id) {
    return new Promise((resolve) => {
      for (let i = 0; i < number_cards; i++) {
        setTimeout(function () {
          const back_html = card_tool.set_card_back(card_type);
          back_html.style.pointerEvents = "none";
          card_tool.card_to_player(player_id, back_html);
        }, i * 200);
      }
      setTimeout(resolve, number_cards * 500, "done");
    });
  },
  card_click_event(card_list) {
    for (let i in card_list) {
      const card = document.getElementById("card_" + card_list[i].toString());
      const border = card.style.border;
      card.addEventListener("click", function () {
        if (card.style.top === "-25px") {
          card.style.top = "";
          card.style.border = border;
          card.style.zIndex = 0;
        } else {
          card.style.top = "-25px";
          card.style.border = "4px solid #FFD700";
          card.style.zIndex = 2;
        }
        const checker_obj = card_tool.check_clicked_card(
          player_controller.whoima()
        );
        const clicked_one = checker_obj.clicked_card === 1;
        const matching = checker_obj.matching === "True";
        if (matching && clicked_one) {
          card_tool.show_play_button();
        } else {
          card_tool.hide_play_button();
        }
      });
    }
  },
};
