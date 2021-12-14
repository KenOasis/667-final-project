const leaveGame = () => {
  const game_id = document.getElementById("game_id").value;
  const url = "http://" + location.host + "/lobby/leaveGame";
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
    .then((result) => {
      if (result.status === "success") {
        location.href = "/lobby";
      }
    })
    .catch((err) => console.log(err));
};

const gameReady = () => {
  const game_id = document.getElementById("game_id").value;
  const url = "http://" + location.host + "/lobby/room/gameReady";
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
    .then((result) => {
      // if (result.status === "success") {
      //   location.href = "/lobby";
      // }
    })
    .catch((err) => console.log(err));
};
const startGame = (game_id) => {
  const game_name = document.title;
  const form = document.createElement("form");
  form.style = "display: none;";
  form.method = "POST";
  form.action = "/game/join";
  const inputId = document.createElement("input");
  inputId.type = "hidden";
  inputId.name = "game_id";
  inputId.value = game_id;
  const inputName = document.createElement("input");
  inputName.type = "hidden";
  inputName.name = "game_name";
  inputName.value = game_name;
  form.appendChild(inputId);
  form.appendChild(inputName);
  document.body.append(form);
  form.submit();
};
