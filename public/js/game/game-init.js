// this is the user_list
const user_list = JSON.parse(document.getElementById("user_list").value);

const player_profile = {
  set_user(html_id, user) {
    const profile = document.getElementById(html_id);
    const detail = profile.getElementsByClassName("name")[0];
    detail.innerText = user.username;
    profile.id = "user_" + user.user_id.toString();
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
        game_class.set_players_location();

        return results.game_state;
      } else {
        console.log(resulst.status + " : " + results.message);
      }
    })
    .then((game_state) => {
      const game_class = new game_state_helper(game_state);
      const order = game_class.arrange_players();
      game_class
        .show_top_bottom_card(order[0])
        .then((result) => {
          if (result === "done") {
            game_class.set_current_player();
            game_class.set_card_click_event();
          }
        })
        .catch((err) => {
          console.log("inside", err);
        });
      game_class.show_left_right_card(order[1]);
      game_class.show_top_bottom_card(order[2]);
      game_class.show_left_right_card(order[3]);
      game_class.set_side_stuff();
    })
    .catch((error) => console.log("outside", error));
};

loadGameState();
