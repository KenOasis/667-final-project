const toastContainer = document.getElementById("toast_container");
const userListContainer = document.getElementById("user_list");
const gameListContainer = document.getElementById("game_list");
const lobbyChat = document.getElementById("lobby_chat");
const chatInput = document.getElementById("chat_input");
const gameNameInput = document.getElementById("game_name");
const lobbyMessage = document.getElementById("lobby_message");
let whoami = document.getElementById("whoami").value;

// a constructor to construct a Toast with given message
const addToast = (message) => {
  const toastDiv = document.createElement("div");
  toastDiv.className = "toast";
  toastDiv.setAttribute("role", "alert");
  toastDiv.setAttributeNode;
  toastDiv.ariaLive = "assertive";
  toastDiv.ariaAtomic = true;
  toastDiv.setAttribute("data-bs-delay", "2500");

  const headerDiv = document.createElement("div");
  headerDiv.className = "toast-header";

  const strongElement = document.createElement("strong");
  strongElement.className = "me-auto";
  strongElement.innerHTML = "Lobby";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "btn-close";
  closeButton.setAttribute("data-bs-dismiss", "toast");
  closeButton.ariaLabel = "Close";

  const messageDiv = document.createElement("div");
  messageDiv.className = "toast-body";
  messageDiv.innerHTML = message;

  headerDiv.appendChild(strongElement);
  headerDiv.appendChild(closeButton);
  toastDiv.appendChild(headerDiv);
  toastDiv.appendChild(messageDiv);

  toastContainer.appendChild(toastDiv);

  return toastDiv;
};

// update the user_list in lobby
const constructUserElement = (user) => {
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center";
  li.id = "user-" + user.username;
  const userNameDiv = document.createElement("div");
  userNameDiv.className = "badge bg-light text-primary";
  userNameDiv.innerHTML = user.username;
  const span = document.createElement("span");
  span.className = "badge bg-primary rounded-spill";
  span.innerHTML = user.status;
  li.appendChild(userNameDiv);
  li.appendChild(span);
  return li;
};

const initialUserList = (list) => {
  userListContainer.innerHTML = "";
  list.forEach((user) => {
    const li = constructUserElement(user);
    userListContainer.appendChild(li);
  });
};

// recieve/update chat
const updateChat = (chat) => {
  const localTime = moment(chat.timestamp).utc(true).format("h:mm a");
  const div1 = document.createElement("div");
  div1.className = "card border-0 m-3";
  const div2 = document.createElement("div");
  div2.className = "card-body bg-light";
  const span = document.createElement("span");
  span.className = "badge text-primary";
  span.innerHTML =
    chat.username + " " + `<b class="text-danger">${localTime}</b>`;
  const messageP = document.createElement("p");
  messageP.className = "card-text text-primary";
  messageP.innerHTML = chat.message;
  div2.appendChild(span);
  div2.appendChild(messageP);
  div1.appendChild(div2);
  lobbyChat.appendChild(div1);
};

const constructGameElement = (game) => {
  const game_li = document.createElement("li");
  game_li.className = "list-group-item d-flex justify-content-between";
  game_li.id = "game-" + game.game_id;
  game_li.dataset.game_id = game.game_id;

  const name_div = document.createElement("div");
  name_div.className = "badge bg-light text-primary";
  name_div.id = "game-" + game.game_id + "-name";
  name_div.innerHTML = game.name;

  const buttons_div = document.createElement("div");
  const userList = game.users.map((user) => user.username);
  // check whether the user is in this game
  let indexOfUser = userList.indexOf(whoami);
  if (indexOfUser !== -1) {
    const user = game.users[indexOfUser];
    if (user.status === "ready") {
      const span_leave = document.createElement("span");
      span_leave.className = "btn badge bg-danger rounded-spill mx-1";
      span_leave.id = "game-" + game.game_id + "-leave";
      span_leave.onclick = leaveGame;
      span_leave.innerHTML = "leave";
      buttons_div.appendChild(span_leave);
    } else {
      // The game is playing
      const span_reconnect = document.createElement("span");
      span_reconnect.className = "btn badge bg-primary rounded-spill mx-1";
      span_reconnect.id = "game-" + game.game_id + "-reconnect";
      span_reconnect.innerHTML = "reconnect";
      span_reconnect.dataset.game_id = game.game_id;
      // TODO implement the reconnectGame();
      span_reconnect.onclick = reconnectGame;
      buttons_div.appendChild(span_reconnect);
    }
    // user list toggle button
    const span_users = document.createElement("span");
    span_users.className =
      "btn badge bg-primary rounded-spill mx-1 has-popover";
    span_users.setAttribute("title", `Use(s) in the room ${game.name}`);
    span_users.setAttribute("data-bs-html", "true");
    span_users.setAttribute(
      "data-bs-content",
      `${game.users.map((user) => user.username).join("<br/>")}`
    );
    span_users.innerHTML = "userList";
    buttons_div.appendChild(span_users);
  } else {
    // The user is not in this game
    if (game.users.length < game.capacity) {
      // not full
      const span_join = document.createElement("span");
      span_join.className = "btn badge bg-warning rounded-spill mx-1";
      span_join.id = "game-" + game.game_id + "-join";
      span_join.onclick = joinGame;
      span_join.innerHTML = "join";
      buttons_div.appendChild(span_join);
    }
    // if game is full, them no button added
  }

  const status_div = document.createElement("div");
  const vacancy_span = document.createElement("span");
  vacancy_span.className = "badge bg-danger rounded-spill mx-1";
  vacancy_span.id = "game-" + game.game_id + "-vacancy";
  vacancy_span.innerHTML = game.users.length + " / " + game.capacity;
  const status_span = document.createElement("span");
  status_span.className = "badge bg-primary rounded-spill";
  status_span.id = "game-" + game.game_id + "-status";
  status_span.innerHTML = game.status;
  status_div.appendChild(vacancy_span);
  status_div.appendChild(status_span);

  game_li.appendChild(name_div);
  game_li.appendChild(buttons_div);
  game_li.appendChild(status_div);

  return game_li;
};

const initialGameList = (gamelist) => {
  gameListContainer.innerHTML = "";
  gamelist.forEach((game) => {
    const gameElement = constructGameElement(game);
    gameListContainer.appendChild(gameElement);
  });
};
