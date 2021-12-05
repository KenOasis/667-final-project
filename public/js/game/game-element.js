/**
 *
 *
 * this class is used for read the game state
 * and get the data you want
 *
 */
class game_state_helper {
  constructor(game_state) {
    this.game_state = game_state;
  }

  set_side_stuff() {
    this.set_match();
    this.set_deck();
    this.show_discard();
  }
  /**
   * arrange the player's location by game_order
   *
   * return a list of number ->[buttom_player.id, left_id, top_id, left_id]
   */
  arrange_players() {
    const order = this.game_state.game_order;
    const bottom_player = this.game_state.receiver;
    const cut = order.indexOf(bottom_player);
    const left = order.slice(cut, order.lenght);
    const right = order.slice(0, cut);
    const from_bottom_to_right = left.concat(right);
    return from_bottom_to_right;
  }
  /**
   * find the players detail info in game_state.players
   *
   * return the the this player_id state(object)
   * {
   * user_id,
   * cards/number_of_card,
   * uno
   * }
   */
  find_one_player(id) {
    const players = this.game_state.players;
    const player_info = players.filter((player) => player.user_id === id);
    return player_info[0];
  }
  /**
   * find the matching cards in the buttom player's card
   * return the list of card_id from buttom player match to the game_state.matching
   *
   */
  find_matching_card() {
    const matching = this.game_state.matching;
    const bottom_player = this.find_one_player(this.game_state.receiver).cards;
    const match_list = bottom_player.filter((card) => {
      //card_tool from card_util.js
      const card_detail = CardModule.get_card_detail(card);
      if (
        matching.color === card_detail.card_color ||
        matching.value === card_detail.card_value ||
        card_detail.card_color === "none"
      ) {
        return card;
      }
    });

    return match_list;
  }

  /**
   *
   * set up the top_bottom player's cards to their loca
   *
   */
  show_top_bottom_card(player_id) {
    const player_info = this.find_one_player(player_id);
    if ("cards" in player_info) {
      const cards = player_info.cards;
      //action_util from action_util
      return action_util.add_card_event(cards);
    } else {
      const number_cards = player_info.number_of_cards;
      return action_util.add_card_back_event(number_cards, "back", player_id);
    }
  }
  show_left_right_card(player_id) {
    const player_info = this.find_one_player(player_id);
    const number_of_card = player_info.number_of_cards;
    //action_util from action_util
    return action_util.add_card_back_event(
      number_of_card,
      "cardcol",
      player_id
    );
  }
  /**
   * useing this first
   * like sitting down the players
   *
   */

  set_players_location() {
    const order = this.arrange_players();
    card_tool.sit_player(order[0], "container_bottom");
    card_tool.sit_player(order[1], "container_left");
    card_tool.sit_player(order[2], "container_top");
    card_tool.sit_player(order[3], "container_right");
  }
  // show_discard
  show_discard() {
    const container = document.getElementById("discard_pile");
    const discards = this.game_state.discards.reverse();

    container.innerHTML = "";
    //action_util from action_util
    container.appendChild(action_util.show_discard(discards));
  }
  //show matching color and number to players
  set_match() {
    const color = {
      red: "rgb(255,0,0)",
      blue: "rgb(0,0,255)",
      green: "rgb(60,179,113)",
      yellow: "rgb(255, 210, 71)",
    };
    const match_number = this.game_state.matching.value;
    const match_color = this.game_state.matching.color;
    const direction = this.game_state.game_direction;
    const num_html = document.getElementById("match_set");
    num_html.innerHTML =
      page_effect.show_match_set(match_number, color[match_color]) +
      page_effect.show_direction(color[match_color], direction);
  }
  set_deck() {
    const deck = document.getElementById("card_deck");
    deck.innerText = this.game_state.card_deck;
  }

  check_current_is_receiver() {
    const current_player = this.game_state.current_player;
    const bottom_player = this.game_state.receiver;
    return current_player == bottom_player;
  }
  /**
   * coloring the matching card for buttom player
   * using for receiver's turn
   * Setting up "matching" Attribute
   * if(match) matching: "True" else "False"
   */
  color_match_card() {
    const bottom = this.find_one_player(this.game_state.receiver).cards;
    const match = this.find_matching_card();
    let hand_card_matching = [];
    for (let i in bottom) {
      const card = document.getElementById("card_" + bottom[i].toString());
      if (match.includes(bottom[i])) {
        hand_card_matching.push(bottom[i]);
        card.setAttribute("matching", "True");
        card.style.border = "4px solid #FFA07A";
      } else {
        card.setAttribute("matching", "False");
      }
    }
    return hand_card_matching;
  }
  /**
   * set current_player state in page
   * if current_player ==receiver
   *  show match color and button
   * else
   * highlight the border
   *
   */
  set_current_player(wild_four) {
    const action = this.game_state.undone_action;
    if (this.check_current_is_receiver()) {
      // page_util.js
      this.check_user_uno();
      if (action == "draw") {
        page_effect.show_pass_button();
        page_effect.lock_desk_button();
      }
      //else if(action == "chanllage")
      else if (action == "none") {
        page_effect.unlock_desk_button();
        page_effect.hide_pass_button();
      } else {
        page_effect.lock_desk_button();
        const last_player_id = this.find_last_player();
        const last_player_name =
          player_profile.get_user_name(last_player_id).username;
        action_util.change_modal_body(
          this.game_state.matching.color,
          last_player_name
        );
        if (this.check_empty()) {
          last_wild_four();
        } else {
          const question_modal = document.getElementById("ChallengeModal");
          const mymodal = new bootstrap.Modal(question_modal);
          mymodal.toggle();
        }
        page_effect.hide_pass_button();
      }
    } else {
      page_effect.lock_desk_button();
      page_effect.lock_uno_button();
    }
    const current_player = this.game_state.current_player;
    this.set_call_uno();
    page_effect.highlight_current(current_player);
    //action_util.js
    action_util.set_undone_action(action, this.game_state.receiver);
  }
  /**
   * set up the click_card_event
   *
   */
  set_card_click_event() {
    const receiver_id = this.game_state.receiver;
    const bottom_cards = this.find_one_player(receiver_id).cards;
    //action_util.js
    action_util.remove_click_event(bottom_cards);
    action_util.card_click_event(bottom_cards);
  }
  delete_click_event() {
    const receiver_id = this.game_state.receiver;
    const bottom_cards = this.find_one_player(receiver_id).cards;
    //action_util.js
    action_util.remove_click_event(bottom_cards);
    //page_util.js
    page_effect.hide_all_button();
  }
  refresh_hand_card(player_id) {
    const card_list = this.find_one_player(player_id).cards;
    const container = document.getElementById("player_" + player_id.toString());
    container.innerHTML = "";
    for (let i = 0; i < card_list.length; i++) {
      //card_util.js
      const card_html = card_tool.set_cards(card_list[i]);
      card_tool.card_to_player(player_id, card_html);
    }
  }
  find_last_player() {
    const players_list = this.arrange_players();
    const index = players_list.indexOf(this.game_state.current_player);
    if (this.game_state.direction === 1) {
      return players_list[1];
    } else {
      return players_list[3];
    }
  }
  check_number_of_card(id) {
    const player = this.find_one_player(id);
    const number_cards = player.number_of_cards;
    return number_cards;
  }
  find_position(id) {
    const player_list = this.arrange_players();
    const position = player_list.indexOf(id);
    if (position == 0) {
      return "bottom";
    }
    if (position == 1) {
      return "left";
    }
    if (position == 2) {
      return "top";
    }
    if (position == 3) {
      return "right";
    }
  }
  set_number_of_card(id) {
    const position = this.find_position(id);
    const number_cards = this.check_number_of_card(id);
    page_effect.show_number_card(position, number_cards);
  }
  show_back_card_again(id) {
    const position = this.find_position(id);
    const number_card = this.check_number_of_card(id);
    if (number_card >= 10) {
      action_util.show_fixed_cards(position, id, 10);
      page_effect.show_number_card(position, number_card);
    } else {
      action_util.show_fixed_cards(position, id, number_card);
      page_effect.show_number_card(position, "");
    }
  }
  check_user_uno() {
    if (this.check_current_is_receiver()) {
      const hand_card_matching = this.color_match_card();
      const player = this.find_one_player(this.game_state.receiver);
      if (player.uno) {
        page_effect.lock_uno_button();
      } else {
        if (
          hand_card_matching.length <= 2 &&
          hand_card_matching != 0 &&
          player.number_of_cards <= 2
        ) {
          page_effect.unlock_uno_button();
        } else {
          page_effect.lock_uno_button();
        }
      }
    }
  }
  set_call_uno() {
    const players = this.game_state.players;
    players.map((player) => {
      const player_id = player.user_id;

      if (player.uno) {
        page_effect.show_call_uno(player_id);
      } else {
        const position = this.find_position(player_id);

        page_effect.back_to_origin_avater(position, player_id);
      }
    });
  }
  add_back_side_card(player_id, add_number) {
    const position = this.find_position(player_id);
    const number_card = this.check_number_of_card(player_id);
    if (number_card >= 10) {
      this.show_back_card_again(player_id);
    } else {
      if (position === "left" || position === "right") {
        action_util.add_card_back_event(add_number, "cardcol", player_id);
      } else {
        action_util.add_card_back_event(add_number, "back", player_id);
      }
    }
  }
  action_empty_card() {
    if (this.check_empty()) {
      end_game();
    }
  }
  check_empty() {
    const players = this.game_state.players;
    let has_empty_card = false;
    players.map((player) => {
      if (player.number_of_cards === 0) {
        has_empty_card = true;
        return player;
      }
    });
    return has_empty_card;
  }
  action_empty_desk() {
    const desk = this.game_state.card_deck;
    if (desk === 0) {
      end_game();
    }
  }
}
