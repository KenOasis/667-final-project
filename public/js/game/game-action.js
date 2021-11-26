// Action to draw a card
function draw_card_action() {
  const url = "http://" + location.host + "/game/drawcard";
  const game_id = JSON.parse(document.getElementById("user_list").value)[0]
    .game_id;
  const body = {
    game_id,
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
      if (results.status !== "success") {
        console.log(results.message);
      }
    })
    .catch((error) => console.log(error));
}

function pass_action() {
  const url = "http://" + location.host + "/game/pass";
  const game_id = JSON.parse(document.getElementById("user_list").value)[0]
    .game_id;
  const body = {
    game_id,
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
      if (results.status !== "success") {
        console.log(results.message);
      }
    })
    .catch((error) => console.log(error));
}

function play_card_action(body) {
  const url = "http://" + location.host + "/game/playcard";
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
      if (results.status !== "success") {
        console.log(results.message);
      }
    })
    .catch((error) => console.log(error));
}

function play_card() {
  const game_id = JSON.parse(document.getElementById("user_list").value)[0]
    .game_id;
  const iam = player_controller.whoami();
  const player = document.getElementById("player_" + iam);
  let undone_action = player.getAttribute("undone_action");
  //card_tool from card_util.js
  let obj = card_tool.check_clicked_card(iam);
  const card_id = obj.card_id;
  let body;
  if (obj.matching === "True") {
    let card_info = CardModule.get_card_detail(obj.card_id);
    if (card_info.card_color != "none") {
      body = {
        game_id: game_id,
        card_id: card_id,
        undone_action: undone_action,
      };
      play_card_action(body);
    }
  }
}

function color_selector(event) {
  event.preventDefault();
  const color = event.target.id;
  const game_id = JSON.parse(document.getElementById("user_list").value)[0]
    .game_id;
  const iam = player_controller.whoami();
  const player = document.getElementById("player_" + iam);
  let undone_action = player.getAttribute("undone_action");
  //card_tool from card_util.js
  let obj = card_tool.check_clicked_card(iam);
  const card_id = obj.card_id;
  let body;
  body = {
    game_id: game_id,
    card_id: card_id,
    color: color,
    undone_action: undone_action,
  };
  play_card_action(body);
}
