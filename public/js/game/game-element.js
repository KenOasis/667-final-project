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
        matching.number === card_detail.card_value ||
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
    const discards = this.game_state.discards;
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
    const match_number = this.game_state.matching.number;
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
    for (let i in bottom) {
      const card = document.getElementById("card_" + bottom[i].toString());
      if (match.includes(bottom[i])) {
        card.setAttribute("matching", "True");
        card.style.border = "4px solid #FFA07A";
      } else {
        card.setAttribute("matching", "False");
      }
    }
  }
  /**
   * set current_player state in page
   * if current_player ==receiver
   *  show match color and button
   * else
   * highlight the border
   *
   */
  set_current_player() {
    const action = this.game_state.undone_action;
    if (this.check_current_is_receiver()) {
      // page_util.js
      page_effect.unlock_uno_button();
      if (action == "draw") {
        page_effect.show_pass_button();
        page_effect.lock_desk_button();
      }
      //else if(action == "chanllage")
      else {
        page_effect.unlock_desk_button();
        page_effect.unlock_uno_button();
        page_effect.hide_pass_button();
      }
      console.log("set_current_player", action);
    } else {
      const current_player = this.game_state.current_player;
      page_effect.highlight_current(current_player);
      page_effect.lock_desk_button();
    }
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
}
