const host = location.host;
const socket = io(host + "/game");

// this is the user_list
const user_list = JSON.parse(document.getElementById("user_list").value);

console.log(user_list);

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
        console.log(results.game_state);
      } else {
        console.log(resulst.status + " : " + results.message);
      }
    })
    .catch((error) => console.log(error));
};

loadGameState();
