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

function play_card_action() {
  const url = "http://" + location.host + "/game/sayuno";
  const game_id = JSON.parse(document.getElementById("user_list").value)[0]
    .game_id;
  const body = {
    game_id: game_id,
    // card_id: 108,
    // color: "blue",
    // undone_action: "none", // this should get from previous game_state
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

function play_card() {
  let buttom_player = document.getElementById("container_bottom");
  let container = buttom_player.getElementsByClassName("hand")[0];
  const id = parseInt(container.id.replace(/player_/g, ""));

  let obj = card_tool.check_clicked_card(id);
  let card_info = CardModule.get_card_detail(obj.card_id);

  if (obj.matching === "True") {
    let card_info = CardModule.get_card_detail(obj.card_id);
    if (card_info.card_type === "wild") {
      const play = document.getElementById("play");
      play.setAttribute("data-bs-toggle", "modal");
      play.setAttribute("data-bs-target", "#modal_templete");
      action_util.wild_color_selector();
      const modal = document.getElementById("modal_templete");
      modal.style.display = "block";
    }
    console.log(card_info);
  }
  // if(obj.matching ==="True"){
  //   const card = CardModule.get_card_detail(obj.card_id);
  //   if(card.card_value === "wild"){
  //     const modal = document.getElementById("modal");
  //     modal.classList.add("show");
  //     modal.style.display="block";

  //   }
  // }
}

function color_selecter(color) {
  const game_id = JSON.parse(document.getElementById("user_list").value)[0]
    .game_id;
  const iam = player_controller.whoima();
  let obj = card_tool.check_clicked_card(iam);
  const card_id = obj.card_id;
  const player = document.getElementById("player_", iam.toString());
  console.log(player);
  // const player_action = player.getAttribute("undone_action");
  // const body = {
  //   game_id: game_id,
  //   card_id: card_id,
  //   color: color,
  //   undone_action: player_action,
  // };
  // console.log(body);
}
/**Action utility */
