let page_effect = {
  highlight_current(player_id) {
    const user = document.getElementById("user_" + player_id.toString());
    const avater = user.getElementsByClassName("avater")[0];
    avater.style.border = "4px solid #FF0000";
    avater.style.borderRadius = "15px";
  },

  cancel_highlinght() {
    const avater = document.querySelectorAll(".avater");
    console.log(avater);
    for (let i = 0; i < avater.length; i++) {
      avater[i].style.border = "";
      avater[i].style.borderRadius = "";
    }
  },

  show_play_button(show_modal) {
    const play = document.getElementById("play");
    if (show_modal) {
      play.setAttribute("data-bs-toggle", "modal");
      play.setAttribute("data-bs-target", "#color_selector");
    } else {
      play.setAttribute("data-bs-toggle", "");
      play.setAttribute("data-bs-target", "");
    }
    play.disabled = false;
    play.style.zIndex = 4;
  },

  hide_play_button() {
    const play = document.getElementById("play");
    if (play.hasAttribute("data-bs-target")) {
      play.removeAttribute("data-bs-target");
      play.removeAttribute("data-bs-toggle");
    }
    play.disabled = true;
    play.style.zIndex = 0;
  },

  hide_pass_button() {
    const pass = document.getElementById("pass");
    pass.disabled = true;
    pass.style.zIndex = 0;
  },
  show_pass_button() {
    const pass = document.getElementById("pass");
    pass.disabled = false;
    pass.style.zIndex = 4;
  },
  lock_desk_button() {
    const desk = document.getElementById("draw");
    desk.disabled = true;
  },
  unlock_desk_button() {
    const desk = document.getElementById("draw");
    desk.disabled = false;
  },
  lock_uno_button() {
    const uno = document.getElementById("uno");
    uno.style.zIndex = 0;
    uno.disabled = true;
  },
  unlock_uno_button() {
    const uno = document.getElementById("uno");
    uno.style.zIndex = 2;
    uno.disabled = false;
  },
  // show_discard(card_list) {
  //   const discrd = document.createElement("div");
  //   discrd.id = "discard_pile";
  //   discrd.className = "col-md-4 hand";
  //   for (let i in card_list) {
  //     const card = card_tool.set_cards(card_list[i], "discard");
  //     card.style.pointerEvents = "none";
  //     discrd.appendChild(card);
  //   }
  //   return discrd;
  // },
  show_match_set(number, color) {
    const html_string = `<h1 class="match_number" style = "color:${color};"> ${number}</h1>`;
    return html_string;
  },
  show_direction(color, direction) {
    let direction_sigh;
    if (direction == 1) {
      direction_sigh = "bi bi-arrow-clockwise fs-1";
    } else {
      direction_sigh = "bi bi-arrow-counterclockwise fs-1";
    }
    return `<i class="${direction_sigh}" style="color:${color};"></i>`;
  },
  hide_all_button() {
    this.hide_play_button();
    this.hide_pass_button();
    this.lock_uno_button();
  },
};
