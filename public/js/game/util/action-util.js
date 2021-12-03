let player_controller = {
  whoami() {
    let buttom_player = document.getElementById("container_bottom");
    let container = buttom_player.getElementsByClassName("hand")[0];
    const id = parseInt(container.id.replace(/player_/g, ""));
    return id;
  },
};
let action_util = {
  add_card_event(card_list) {
    const player_id = player_controller.whoami();
    return new Promise((resolve) => {
      for (let i = 0; i < card_list.length; i++) {
        setTimeout(function () {
          //card_tool from card_util.js
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
          //card_tool from card_util.js
          const back_html = card_tool.set_card_back(card_type);
          back_html.style.pointerEvents = "none";
          card_tool.card_to_player(player_id, back_html);
        }, i * 200);
      }
      setTimeout(resolve, number_cards * 300, "done");
    });
  },
  set_undone_action(action, player_id) {
    const player = document.getElementById("player_" + player_id.toString());
    player.setAttribute("undone_action", action);
  },
  card_click_event(card_list) {
    for (let i in card_list) {
      const card = document.getElementById("card_" + card_list[i].toString());
      card.addEventListener("click", clicked_card(card));
    }
  },
  remove_click_event(card_list) {
    if (card_list.length != 0) {
      for (let i in card_list) {
        const card = document.getElementById("card_" + card_list[i].toString());
        card.style.cssText = "";
        const clone_card = card.cloneNode(true);
        card.parentNode.replaceChild(clone_card, card);
      }
    }
  },
  show_discard(card_list) {
    const discrd = document.createElement("div");
    discrd.id = "discard_pile";
    discrd.className = "col-md-4 hand";
    for (let i in card_list) {
      //card_tool from card_util.js
      const card = card_tool.set_cards(card_list[i], "discard");
      card.style.pointerEvents = "none";
      discrd.appendChild(card);
    }
    return discrd;
  },
  change_modal_body(color, last_player_name) {
    const color_obj = {
      red: "rgb(255,0,0)",
      blue: "rgb(0,0,255)",
      green: "rgb(60,179,113)",
      yellow: "rgb(255, 210, 71)",
    };
    let body = `<p>${last_player_name} played a +4. if you think they have <span style="color:${color_obj[color]};"> matching </span> cards in their hand, you can challenge them! (Success +0, Fail +6) </p>`;
    const modal_body = document.getElementById("modal_body");
    modal_body.innerHTML = body;
  },
  show_fixed_cards(position, player_id, number_card) {
    let cardback;
    if (position === "left" || position === "right") {
      cardback = "cardcol";
    }
    if (position === "top") {
      cardback = "back";
    }
    const player_container = document.getElementById("player_" + player_id);
    player_container.innerHTML = "";
    for (let i = 0; i < number_card; i++) {
      const back_html = card_tool.set_card_back(cardback);
      back_html.style.pointerEvents = "none";
      card_tool.card_to_player(player_id, back_html);
    }
  },
  remove_one_card(card_id) {
    const card = document.getElementById("card_" + card_id);
    card.remove();
  },
};
let clicked_card = (card) => {
  return () => {
    if (card.style.top === "-25px") {
      card.style.top = "";
      card.style.zIndex = 0;
    } else {
      card.style.top = "-25px";
      card.style.zIndex = 2;
    }
    //card_tool from card_util.js
    card_tool.check_clicked_card(player_controller.whoami());
  };
};
