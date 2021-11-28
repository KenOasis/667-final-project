// this is the user_list
const user_list = JSON.parse(document.getElementById("user_list").value);

const game_status_prompt = document.getElementById("game_status_prompt");

const get_current_player = (game_state) => {
  return user_list.filter(
    (user) => user.user_id === game_state.current_player
  )[0].username;
};

const get_action_performer = (action) => {
  return user_list.filter((user) => user.user_id === action.performer)[0]
    .username;
};

const show_action_prompts = (update) => {
  const actions = update.actions;
  const prompts = [];
  for (let i = 0; i < actions.length; ++i) {
    const action = actions[i];
    const action_performer = get_action_performer(action);
    switch (action.type) {
      case "play_card":
        {
          prompts.push(`${action_performer} plays a card.`);
        }
        break;
      case "uno_penalty":
        {
          prompts.push(
            `${action_performer} forgot called uno! Drawing two cards.`
          );
        }
        break;
      case "draw_card":
        {
          prompts.push(`${action_performer} draws a card.`);
        }
        break;
      case "pass":
        {
          prompts.push(`${action_performer} skips his/her turn.`);
        }
        break;
      case "reverse":
        {
          prompts.push(`Game direction has changed.`);
        }
        break;
      case "skip":
        {
          prompts.push(`${action_performer} skips his/her turn.`);
        }
        break;
      case "draw_two":
        {
          prompts.push(
            `${action_performer} draws two cards and skips his/her turn.`
          );
        }
        break;
      case "wild":
        {
          prompts.push(`${action_performer} selects color ${action.color}.`);
        }
        break;
      case "wild_draw_four":
        {
          prompts.push(
            `${action_performer} selects color ${action.color} and next player is doing challenge.`
          );
        }
        break;
      case "challenge":
        {
          if (action.is_challenge === false) {
            prompts.push(
              `${action_performer} doesn't challenge wild draw four.`
            );
            prompts.push(
              `${action_performer} draws ${action.penalty_count} cards and skips his/her own round.`
            );
          } else if (action.penalty_count === 6) {
            // challenge failed
            prompts.push(`${action_performer} challenges the wild draw four.`);
            prompts.push(`Chanllenge failed.`);
            prompts.push(
              `${action_performer} draws ${action.penalty_count} cards and skips his/her round.`
            );
          } else {
            // challenge success
            prompts.push(`${action_performer} challenges the wild draw four.`);
            prompts.push(`Chanllenge success.`);

            const penalty_player = user_list.filter((user) => {
              user.user_id === action.penalty_player;
            })[0].username;

            prompts.push(
              `${penalty_player} draws ${action.penalty_count} cards, ${action_performer} continues his/her round.`
            );
          }
        }
        break;
      default:
        break;
    }
  }
  const prompts_message = prompts.join("<br>");
  game_status_prompt.innerHTML = prompts_message;
};

const player_profile = {
  set_user(html_id, user) {
    const profile = document.getElementById(html_id);
    const detail = profile.getElementsByClassName("name")[0];
    detail.innerText = user.username;
    profile.id = "user_" + user.user_id.toString();
    const avater = profile.getElementsByClassName("avater")[0];
    avater.id = "avater_" + user.user_id.toString();
  },
  set_user_name(game_order_list, user) {
    const position = game_order_list.indexOf(user.user_id);
    if (position == 1) {
      this.set_user("left_user", user);
    }
    if (position == 2) {
      this.set_user("top_user", user);
    }
    if (position == 3) {
      this.set_user("right_user", user);
    }
  },
  get_user_name(id) {
    const user = user_list.filter((userobj) => {
      if (userobj.user_id === id) {
        return userobj;
      }
    });
    return user[0];
  },
};

const loadGameState = () => {
  const url = "http://" + location.host + "/game/loadgamestate";
  const body = {
    game_id: user_list[0].game_id,
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .then((response) => response.json())
    .then((results) => {
      if (results.status === "success") {
        const game_state = results.game_state;
        const game_class = new game_state_helper(game_state);
        const game_order = game_class.arrange_players();
        for (let i = 0; i < game_order.length; i++) {
          player_profile.set_user_name(game_order, user_list[i]);
        }
        return results.game_state;
      } else {
        console.log(resulst.status + " : " + results.message);
      }
    })
    .then((game_state) => {
      const game_class = new game_state_helper(game_state);
      game_class.set_players_location();
      return game_state;
    })
    .then((game_state) => {
      const game_class = new game_state_helper(game_state);
      const order = game_class.arrange_players();
      game_class
        .show_top_bottom_card(order[0])
        .then((result) => {
          if (result === "done") {
            if (game_class.check_current_is_receiver()) {
              game_class.set_card_click_event();
            } else {
              game_class.delete_click_event();
            }
            game_class.set_current_player();
            game_class.color_match_card();
          }
        })
        .catch((err) => {
          console.log("inside", err);
        });
      if (game_class.check_number_of_card(order[1]) >= 10) {
        game_class.show_back_card_again(order[1]);
      } else {
        game_class.show_left_right_card(order[1]);
      }
      if (game_class.check_number_of_card(order[2]) >= 10) {
        game_class.show_back_card_again(order[2]);
      } else {
        game_class.show_top_bottom_card(order[2]);
      }
      if (game_class.check_number_of_card(order[3]) >= 10) {
        game_class.show_back_card_again(order[3]);
      } else {
        game_class.show_left_right_card(order[3]);
      }
      game_class.set_side_stuff();
      const current_player = get_current_player(game_state);
      if (game_state.card_deck === 80) {
        game_status_prompt.innerText = `Game initial success, ${current_player}'s round`;
      } else {
        game_status_prompt.innerText = `Reconnected game successfully, ${current_player}'s round`;
      }
      return game_state;
    })
    .catch((error) => console.log("outside", error));
};
