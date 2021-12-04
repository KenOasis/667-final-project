// Action to draw a card
function draw_card_action() {
  page_effect.lock_desk_button();
  page_effect.hide_play_button();
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

  let body = {
    game_id: game_id,
    card_id: card_id,
    color: color,
    undone_action: undone_action,
  };
  play_card_action(body);
}

function challenge_wild_four(event) {
  event.preventDefault();
  const anwers = event.target.id;
  const game_id = JSON.parse(document.getElementById("user_list").value)[0]
    .game_id;
  const iam = player_controller.whoami();
  const player = document.getElementById("player_" + iam);
  let undone_action = player.getAttribute("undone_action");
  const is_challenge = anwers === "challenge";
  const body = {
    game_id: game_id,
    is_challenge: is_challenge,
  };
  const url = "http://" + location.host + "/game/challenge";
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

function call_uno() {
  page_effect.lock_uno_button();
  const game_id = JSON.parse(document.getElementById("user_list").value)[0]
    .game_id;
  const body = {
    game_id: game_id,
  };
  const url = "http://" + location.host + "/game/sayuno";
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

// TODO
function end_game() {
  const game_id = JSON.parse(document.getElementById("user_list").value)[0]
    .game_id;
  const url = "http://" + location.host + "/game/endgame";
  const body = {
    game_id: game_id,
  };
  console.log("in game_action", body);
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

function to_lobby() {
  const url = "http://" + location.host + "/lobby";
  window.location.href = url;
}
function last_wild_four() {
  const game_id = JSON.parse(document.getElementById("user_list").value)[0]
    .game_id;
  const is_challenge = false;
  const body = {
    game_id: game_id,
    is_challenge: is_challenge,
  };
  const url = "http://" + location.host + "/game/challenge";
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
