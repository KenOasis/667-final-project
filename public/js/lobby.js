const host = location.host;
const socket = io(host);

const userListContainer = document.getElementById('user_list');
const lobbyChat = document.getElementById('lobby_chat')
const chatInput = document.getElementById('chat_input')

let username;
let userList = [];

// update the user_list in lobby
const updateUserList = (list) => {
  userListContainer.innerHTML = "";
  list.forEach(user => {
    let li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.id = user.user_id;
    let userNameDiv = document.createElement('div');
    userNameDiv.className ="badge bg-light text-primary"
    userNameDiv.innerHTML = user.username;
    let span = document.createElement('span');
    span.className = "badge bg-primary rounded-spill";
    span.innerHTML = user.status;
    li.appendChild(userNameDiv);
    li.appendChild(span);
    userListContainer.appendChild(li);
  })
}

socket.on('userJoin', (data) => {
  // move current user in the first position
  userList = data.filter((element) => element.username !== username);
  let user = data.filter((element) => element.username === username)[0];
  userList.unshift(user);
  updateUserList(userList);
})

socket.on('userName', (data) => {
  username = data;
})

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

socket.on('lobbyChat', (data) => {
  console.log('run');
  updateChat(data);
})