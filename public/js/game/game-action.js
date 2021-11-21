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


function play_card() {
  let buttom_player = document.getElementById("container_bottom");
  let container = buttom_player.getElementsByClassName("hand")[0];
  const id = parseInt(container.id.replace(/player_/g, ""));

  let obj = card_tool.check_clicked_card(id);
  console.log(obj);
  // if(obj.matching ==="True"){
  //   const card = CardModule.get_card_detail(obj.card_id);
  //   if(card.card_value === "wild"){
  //     const modal = document.getElementById("modal");
  //     modal.classList.add("show");
  //     modal.style.display="block";

  //   }
  // }
}
const drawCardAction = {
  performer: 9,
  type: "draw_card",
  card_id: [12], // if (is_performer)
};

/**Action utility */



