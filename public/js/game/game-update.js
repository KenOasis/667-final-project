class game_update_helper {
  constructor(update) {
    this.game_update = update;
  }
  get_play_card_performer_obj() {
    const play_card_player = this.game_update.actions.filter((obj) => {
      if (obj.type == "play_card") {
        return obj;
      }
    });
    return play_card_player[0];
  }
  get_draw_two_card_performer_obj() {
    const draw_card_player = this.game_update.actions.filter((obj) => {
      if (obj.type == "draw_two") {
        return obj;
      }
    });
    return draw_card_player[0];
  }
  get_uno_penalty_player_obj() {
    const uno_caller_obj = this.game_update.actions.filter((obj) => {
      if (obj.type === "uno_penalty") {
        return obj;
      }
    });
    return uno_caller_obj;
  }
  check_card_penalty() {
    const uno_player = this.get_uno_penalty_player_obj();
    if (uno_player.length === 0) {
      return false;
    } else {
      return true;
    }
  }
}
