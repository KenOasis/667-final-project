let page_effect = {
  highlight_current(player_id) {
    const user = document.getElementById("user_" + player_id.toString());
    const avater = user.getElementsByClassName("avater")[0];
    avater.style.border = "4px solid #FF0000";
    avater.style.borderRadius = "15px";
  },

  cancel_highlinght(player_id) {
    const user = document.getElementById("user_" + player_id.toString());
    const avater = user.getElementsByClassName("avater")[0];
    avater.style.border = "none";
    avater.style.borderRadius = "none";
  },

  show_play_button() {
    const play = document.getElementById("play");
    play.style.zIndex = 4;
  },

  hide_play_button() {
    const play = document.getElementById("play");
    play.style.zIndex = 0;
  },

  hide_pass_button() {
    const pass = document.getElementById("pass");
    pass.style.zIndex = 0;
  },

  show_discard(card_list) {
    const discrd = document.createElement("div");
    discrd.id = "discard_pile";
    discrd.className = "col-md-4 hand";
    for (let i in card_list) {
      const card = card_tool.set_cards(card_list[i], "discard");
      card.style.pointerEvents = "none";
      discrd.appendChild(card);
    }
    return discrd;
  },

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
};
