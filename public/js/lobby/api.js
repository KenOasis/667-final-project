const createGame = () => {
  const url = "http://" + location.host + "/lobby/createGame";
  const game_name = gameNameInput.value;
  // TODO add validation to game_name
  const body = {
    game_name: game_name,
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
      // Nothing to do, message was sent by socket
    })
    .catch((err) => console.log(err));
};

const joinGame = (event) => {
  const game_id = event.target.parentNode.parentNode.dataset.game_id;
  const url = "http://" + location.host + "/lobby/joinGame";
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
    .then((result) => {})
    .catch((err) => console.log(err));
};

const leaveGame = (event) => {
  const game_id = event.target.parentNode.parentNode.dataset.game_id;
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
    .then((result) => {})
    .catch((err) => console.log(err));
};

const reconnectGame = (event) => {
  const form = document.createElement("form");
  form.style = "display: none;";
  form.method = "POST";
  form.action = "/game/join";
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "game_id";
  input.value = event.target.dataset.game_id;
  form.appendChild(input);
  document.body.append(form);
  form.submit();
};

// send chat

const sendChat = () => {
  const msg = chatInput.value;
  const url = "http://" + location.host + "/lobby/chat?id=0";
  const body = {
    message: msg,
  };
  if (msg.trim().length > 0) {
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
          chatInput.value = "";
        }
      })
      .catch((err) => console.log(err));
  }
};

const startGame = (game_id) => {
  const form = document.createElement("form");
  form.style = "display: none;";
  form.method = "POST";
  form.action = "/game/join";
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "game_id";
  input.value = game_id;
  form.appendChild(input);
  document.body.append(form);
  form.submit();
};
