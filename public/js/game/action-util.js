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
  set_undone_action(action, player_id) {
    const player = document.getElementById("player_" + player_id.toString());
    player.setAttribute("undone_action", action);
  },
  card_click_event(card_list, is_current_player) {
    for (let i in card_list) {
      const card = document.getElementById("card_" + card_list[i].toString());
      card.addEventListener("click", clicked_card(card, is_current_player));
    }
  },
  remove_click_event(card_list) {
    for (let i in card_list) {
      const card = document.getElementById("card_" + card_list[i].toString());
      card.style.cssText = "";
      const clone_card = card.cloneNode(true);
      card.parentNode.replaceChild(clone_card, card);
    }
  },
  wild_color_selector() {
    const modal_title = document.getElementById("model_title");
    modal_title.innerText = "Choose color";
    const red = create_button("red");
    const blue = create_button("blue");
    const yellow = create_button("yellow");
    const green = create_button("green");
    const modal_body = document.getElementById("modal_body");
    modal_body.innerHTML = "";
    modal_body.appendChild(red);
    modal_body.appendChild(blue);
    modal_body.appendChild(green);
    modal_body.appendChild(yellow);
    console.log(modal_body);
  },
};
function create_button(color) {
  let boot_color;
  if (color == "red") {
    boot_color = "danger";
  }
  if (color == "green") {
    boot_color = "success";
  }
  if (color == "yellow") {
    boot_color = "warning";
  }
  if (color == "blue") {
    boot_color = "primary";
  }
  const btn = document.createElement("button");
  btn.className = `btn btn-lg btn-${boot_color} color_select`;
  btn.id = color;
  btn.setAttribute("data-bs-dismiss", "modal");
  btn.addEventListener("click", function () {
    color_selecter(color);
  });
  return btn;
}

let clicked_card = (card, is_current_player) => {
  return () => {
    if (card.style.top === "-25px") {
      card.style.top = "";
      card.style.zIndex = 0;
    } else {
      card.style.top = "-25px";
      card.style.zIndex = 2;
    }
    if (is_current_player) {
      const checker_obj = card_tool.check_clicked_card(
        player_controller.whoima()
      );
      console.log("obj", checker_obj);
      const clicked_one = checker_obj.clicked_card === 1;
      const matching = checker_obj.matching === "True";
      if (matching && clicked_one) {
        page_effect.show_play_button();
      } else {
        page_effect.hide_play_button();
      }
    } else {
      page_effect.hide_play_button();
    }
  };
};
