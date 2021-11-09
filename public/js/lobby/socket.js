const host = location.host;
const socket = io(host);

// socket event listener
socket.on('userListInitial', (data) => {
  const userList = data.user_list;
  initialUserList(userList);
// }
});

socket.on('userJoinLobby', data => {
if (toastContainer) {
  const newToast = addToast(data.username + " has joined the lobby!");
  let toast = new bootstrap.Toast(newToast);
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
if (toastContainer) {
  const newToast = addToast(data.user.username + " has left the lobby!");
  let toast = new bootstrap.Toast(newToast);  
  toast.show(); 
}
if (data.user.username !== whoami) {
  const queryPattern = `[id^="user-${data.user.username}"]`;
  let currentUser = document.querySelector(queryPattern);
  if (currentUser !== null) {
    userListContainer.removeChild(currentUser);
  }
  const newGameList = gameListManager.userLeaveLobby(data.user.user_id);
  const newGameListElement = initialGameList(newGameList);
}
});


socket.on('updateUserStatus', user => {
const queryPattern = `[id^="user-${user.username}"]`;
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
  gameListManager.init(data);
  initialGameList(data);
});

socket.on('createGame', new_game => {
const gameElement = document.getElementById('game-' + new_game.game_id);
if (gameElement === null) {
  const newGameElement = constructGameElement(new_game);
  gameListContainer.appendChild(newGameElement);
  gameListManager.createGame(new_game);
  if (toastContainer) {
    const newToast = addToast("Game " + new_game.name + " is created.");
    let toast = new bootstrap.Toast(newToast);
    toast.show(); 
  }
}
})

socket.on('joinGame', data => {
const result = gameListManager.joinGame(data.game_id, data.user);
if (result !== null) {
  const new_game = result;
  const new_game_li = constructGameElement(new_game);
  const current_game_li = document.getElementById(`game-${data.game_id}`);
  gameListContainer.insertBefore(new_game_li, current_game_li);
  gameListContainer.removeChild(current_game_li);
}
if (result.status === "full") {
  // TODO trigger the start game action
}
})

socket.on('leaveGame', data => {
const result = gameListManager.leaveGame(data.game_id, data.user);
if (result !== null) {
  const new_game = result;
  const new_game_li = constructGameElement(new_game);
  const current_game_li = document.getElementById(`game-${data.game_id}`);
  gameListContainer.insertBefore(new_game_li, current_game_li);
  gameListContainer.removeChild(current_game_li);
} else {
  // game has no player, remove from the list
  const game_li = document.getElementById(`game-${data.game_id}`);
  gameListContainer.removeChild(game_li);
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