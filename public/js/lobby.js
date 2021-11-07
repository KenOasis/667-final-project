const host = location.host;
const socket = io(host);

const userListContainer = document.getElementById('user_list');
const gameListContainer = document.getElementById('game_list');
const lobbyChat = document.getElementById('lobby_chat');
const chatInput = document.getElementById('chat_input');
const gameNameInput = document.getElementById('game_name');
const lobbyToast = document.getElementById('lobbyToast');
const lobbyMessage = document.getElementById('lobby_message');
let whoami = document.getElementById('whoami').value;;
let gameList = [];
const DUMMY_GAME_LIST = [{
  game_id: 1,
  name: 'Uno',
  users: [{
    user_id: 4,
    username: "Lusd1",
  }, {
    user_id: 6,
    username: "kaka",

  }, {
    user_id: 8,
    username: "Jacky234",
  }],
  capacity: 4,
  status: "waiting"
}, {
  game_id: 2,
  name: "Lol have fun!",
  users: [{
    user_id: 3,
    username: "KimJonEnn52",
  }, {
    user_id: 7,
    username: "Lucas88",
  }, {
    user_id: 11,
    username: "Optimus86",
  }, {
    user_id: 9,
    username: "Savis84",
  }],
  capacity: 4,
  status: "full"
}];

// update the user_list in lobby
const constructUserElement = (user) => {
  const li = document.createElement('li');
  li.className = "list-group-item d-flex justify-content-between align-items-center";
  li.id = "user-" + user.username + user.id;
  const userNameDiv = document.createElement('div');
  userNameDiv.className ="badge bg-light text-primary"
  userNameDiv.innerHTML = user.username;
  const span = document.createElement('span');
  span.className = "badge bg-primary rounded-spill";
  span.innerHTML = user.status;
  li.appendChild(userNameDiv);
  li.appendChild(span);
  return li;
}
const initialUserList = (list) => {
  userListContainer.innerHTML = "";
  list.forEach(user => {
    const li = constructUserElement(user);
    userListContainer.appendChild(li);
  })
}


// send chat

const sendChat = () => {
  const msg = chatInput.value;
  const url = "http://" + location.host + "/lobby/chat?id=0";
  const body = {
    message: msg
  }
  if (msg.trim().length > 0) {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
      headers: new Headers({
        'content-type' : 'application/json'
      })
    }).then(response => response.json())
    .then(results => {
      if (results.status === "success") {
        chatInput.value = "";
      }
    }).catch(err => console.log(err));
  }
}

// recieve/update chat
const updateChat = (chat) => {
  const div1 = document.createElement('div');
  div1.className = "card border-danger mb-1 border-0";
  const div2 = document.createElement('div');
  div2.className = "card-body";
  const span = document.createElement('span');
  span.className = "badge bg-light text-primary"
  span.innerHTML = chat.username;
  const messageP =  document.createElement('p');
  messageP.className = "card-text text-info";
  messageP.innerHTML = chat.message;
  div2.appendChild(span);
  div2.appendChild(messageP);
  div1.appendChild(div2);
  lobbyChat.appendChild(div1);
}


const constructGameElement = (game) => {
  const game_li = document.createElement('li');
  game_li.className = "list-group-item d-flex justify-content-between";
  game_li.id = "game-" + game.game_id;
  game_li.dataset.game_id = game.game_id;

  const name_div = document.createElement('div');
  name_div.className = "badge bg-light text-primary";
  name_div.id = "game-" + game.game_id + "-name";
  name_div.innerHTML = game.name;
  
  const buttons_div = document.createElement('div');
  const userList = game.users.map(user => user.username);
  // check whether the user is in this game
  let indexOfUser = -1;
  if ((indexOfUser = userList.indexOf(whoami))!== -1) {
    const user = game.users[indexOfUser];
    if(user.status === "ready"){
      const span_leave = document.createElement('span');
      span_leave.className = "btn badge bg-warning rounded-spill mx-1";
      span_leave.id = "game-" + game.game_id + "-leave";
      span_leave.onclick = leaveGame;
      span_leave.innerHTML = "leave";
      buttons_div.appendChild(span_leave);
    } else {
      // The game is playing
      const span_join = document.createElement('span');
      span_join.className = "btn badge bg-primary rounded-spill mx-1";
      span_join.id = "game-" + game.game_id + "-join";
      // TODO add eventlistener
      span_join.innerHTML = "join";
      span_join.onclick = joinGame;
      buttons_div.appendChild(span_join);
    }
  } else {
    // The user is not in this game
    if (game.users.length < game.capacity) {
      // not full
      const span_join = document.createElement('span');
      span_join.className = "btn badge bg-warning rounded-spill mx-1";
      span_join.id = "game-" + game.game_id + "-join";
      span_join.onclick = joinGame;
      span_join.innerHTML = "join";
      buttons_div.appendChild(span_join);
    }
    // if game is full, them no button added
  }

  const status_div = document.createElement('div');
  const vacancy_span = document.createElement("span");
  vacancy_span.className = "badge bg-danger rounded-spill mx-1";
  vacancy_span.id = "game-" + game.game_id + "-vacancy";
  vacancy_span.innerHTML = game.users.length + " / " + game.capacity;
  const status_span = document.createElement('span');
  status_span.className = "badge bg-primary rounded-spill";
  status_span.id = "game-" + game.game_id + "-status";
  status_span.innerHTML = game.status;
  status_div.appendChild(vacancy_span);
  status_div.appendChild(status_span);

  game_li.appendChild(name_div);
  game_li.appendChild(buttons_div);
  game_li.appendChild(status_div);

  return game_li;
}
const initialGameList = (gamelist) => {
  gameListContainer.innerHTML = "";
  gamelist.forEach(game => {
    const gameElement = constructGameElement(game);
    gameListContainer.appendChild(gameElement); 
  })
}

const createGame = () => {
  const url = "http://" + location.host + "/lobby/createGame";
  const game_name = gameNameInput.value;
  // TODO add validation to game_name
  const body = {
    game_name: game_name
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    headers: new Headers({
      'content-type' : 'application/json'
    })
  }).then(response => response.json())
  .then(results => {
    if (lobbyToast) {
      lobbyMessage.innerHTML = results.message;
      let toast = new bootstrap.Toast(lobbyToast);
      toast.show(); 
    }
  }).catch(err => console.log(err));
}

const joinGame = (event) => {
  const game_id = event.target.parentNode.parentNode.dataset.game_id;
  console.log(game_id);
}

const leaveGame = (event) => {

}


// socket event listener
socket.on('userListInitial', (data) => {
    const userList = data.user_list;
    initialUserList(userList);
  // }
});

socket.on('userJoinLobby', data => {
  if (lobbyToast) {
    lobbyMessage.innerHTML = data.username + " has joined the lobby!";
    let toast = new bootstrap.Toast(lobbyToast);
    toast.show(); 
  }
  if (data.username !== whoami) {
    const queryPattern = `[id^="user-${data.username}"]`;
    let currentUser = document.querySelector(queryPattern);
    const user = {
      username: data.username,
      status: data.status,
      id: data.id
    }
    const newUser = constructUserElement(user);
    if(currentUser === null) {
      userListContainer.appendChild(newUser)
    } else {
      userListContainer.insertBefore(newUser, currentUser);
      userListContainer.removeChild(currentUser);
    }
  }
});

socket.on('userLeaveLobby', data => {
  if (lobbyToast) {
    lobbyMessage.innerHTML = data.username + " has left the lobby!";
    let toast = new bootstrap.Toast(lobbyToast);  
    toast.show(); 
  }
  if (data.username !== whoami) {
    let  currentUser = document.getElementById('user-' + data.username + data.id);
    if (currentUser !== null) {
      userListContainer.removeChild(currentUser);
    }
  }
});


socket.on('updateUserStatus', data => {
  const user = data;
  const queryPattern = `[id^="user-${data.username}"]`;
  let currentUser = document.querySelector(queryPattern);
  if (currentUser !== null) {
    const newUser = constructUserElement(user);
    userListContainer.insertBefore(newUser, currentUser);
    userListContainer.removeChild(currentUser);
  }
});

socket.on('lobbyChat', (data) => {
  updateChat(data);
});

socket.on('gameListInitial', (data) => {
  gameList = data;
  initialGameList(gameList);
});

socket.on('createGame', data => {
  const new_game = data;
  const gameElement = document.getElementById('game-' + new_game.game_id);
  if (gameElement === null) {
    newGameElement = constructGameElement(new_game);
    gameListContainer.appendChild(newGameElement);
  }
})

// test code for socket handshake.
// socket.on('Hello', (data) => {
//   // if (lobbyToast) {
//   //   lobbyMessage.innerHTML = "Hello!" + data;
//   //   let toast = new bootstrap.Toast(lobbyToast);
//   //   toast.show(); 
//   // }
// });

