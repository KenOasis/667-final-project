let whoima = () => {
  let buttom_player = document.getElementById("container_bottom");
  let container = buttom_player.getElementsByClassName("hand")[0];
  const id = parseInt(container.id.replace(/player_/g, ""));
  return id;
};

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

let add_card_event = (card_list) => {
  const player_id = whoima();
  return new Promise((resolve) => {
    for (let i = 0; i < card_list.length; i++) {
      setTimeout(function () {
        const card_html = card_tool.set_cards(card_list[i]);
        card_tool.card_to_player(player_id, card_html);
      }, i * 200);
    }
    setTimeout(resolve, card_list.length * 300, "done");
  });
};

// draw a card_event
function draw_card(event) {
  event.preventDefault();
  const drawCardAction = {
    performer: 9,
    type: "draw_card",
    card_id: [12, 14], // if (is_performer)
  };
  // fetch game_state and _endpoint
  //then
  add_card_event(drawCardAction.card_id)
    .then((result) => {
      if (result === "done") {
        //set click card event here  game-init function set_current_player()
        // do this with game_state
      }
    })
    .catch((err) => console.log(err));
  //then
  // tell all player what user did
  //catch
}
