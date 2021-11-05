const host = location.host;
const socket = io(host);

const userListContainer = document.getElementById('user_list');
const gameListContainer = document.getElementById('game_list');
const lobbyChat = document.getElementById('lobby_chat')
const chatInput = document.getElementById('chat_input')

let username;
let userList = [];
let gameList = [];
const DUMMY_GAME_LIST = [{
  game_id: 1,
  name: 'Uno',
  users: [{
    user_id: 4,
    username: "Lusd1",
    status: "ready",  // in game status: "playing"
    owner: true
  }, {
    user_id: 6,
    username: "kaka",
    status: "ready",
    owner: false
  }, {
    user_id: 8,
    username: "Jacky234",
    status: "ready",
    owner: false
  }],
  capacity: 4,
  status: "waiting"
}, {
  game_id: 2,
  name: "Lol have fun!",
  users: [{
    user_id: 3,
    username: "KimJonEnn52",
    status: "ready",
    owner: true
  }, {
    user_id: 7,
    username: "Lucas88",
    status: "ready",
    owner: false
  }, {
    user_id: 11,
    username: "Optimus86",
    status: "ready"
  }, {
    user_id: 9,
    username: "Savis84",
    status: "ready",
    owner: false
  }],
  capacity: 4,
  status: "full"
}];


// update the user_list in lobby
const constructUserElement = (user) => {
  const li = document.createElement('li');
  li.className = "list-group-item d-flex justify-content-between align-items-center";
  li.id = user.user_id;
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
const updateUserList = (list) => {
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
  
  const name_div = document.createElement('div');
  name_div.className = "badge bg-light text-primary";
  name_div.id = "game-" + game.game_id + "-name";
  name_div.innerHTML = game.name;
  
  const buttons_div = document.createElement('div');
  const userList = game.users.map(user => user.username);
  console.log(username);
  console.log(userList);
  console.log(userList.indexOf(username));
  // check whether the user is in this game
  let indexOfUser = -1;
  if ((indexOfUser = userList.indexOf(username))!== -1) {
    const user = game.users[indexOfUser];
    if(user.status === "ready"){
      const span_leave = document.createElement('span');
      span_leave.className = "badge bg-warning rounded-spill mx-1";
      span_leave.id = "game-" + game.game_id + "-leave";
      // TODO add eventlistener
      span_leave.innerHTML = "leave";
      if (user.owner !== false) {
        // is the game owner
        const span_start = document.createElement('span');
        span_start.className = "badge bg-primary rounded-spill mx-1";
        span_start.id = "game-" + game.game_id + "-start";
        // TODO add eventlistener
        span_start.innerHTML = "start";
        buttons_div.appendChild(span_start);
      }
      buttons_div.appendChild(span_leave);
    } else {
      // The game is playing
      const span_join = document.createElement('span');
      span_join.className = "badge bg-primary rounded-spill mx-1";
      span_join.id = "game-" + game.game_id + "-join";
      // TODO add eventlistener
      span_join.innerHTML = "join";
      buttons_div.appendChild(span_join);
    }
  } else {
    // The user is not in this game
    if (game.users.length < game.capacity) {
      // not full
      const span_join = document.createElement('span');
      span_join.className = "badge bg-warning rounded-spill mx-1";
      span_join.id = "game-" + game.game_id + "-join";
      // TODO add eventlistener
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
const updateGameList = (gamelist) => {
  gameListContainer.innerHTML = "";
  gamelist.forEach(game => {
    const gameElement = constructGameElement(game);
    gameListContainer.appendChild(gameElement); 
  })
}

// socket event monitor
socket.on('userJoin', (data) => {
  // move current user in the first position
  userList = data.filter((element) => element.username !== username);
  let user = data.filter((element) => element.username === username)[0];
  userList.unshift(user);
  updateUserList(userList);
})

socket.on('userName', (data) => {
  console.log('run');
  username = data;
  // TODO put in gameUpdate event
  updateGameList(DUMMY_GAME_LIST);
})

socket.on('lobbyChat', (data) => {
  console.log('run');
  updateChat(data);
})

