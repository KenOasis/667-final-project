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
          page_effect.show_play_button();
        } else {
          page_effect.hide_play_button();
        }
      });
    }
  },
};
