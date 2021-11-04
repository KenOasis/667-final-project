
const host = location.host;
const socket = io(host);

const userListContainer = document.getElementById('userList');
let username;
let userList = [];
const updateUserList = (list) => {
  userListContainer.innerHTML = "";
  list.forEach(user => {
    let li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.id = user.user_id;
    let userName = document.createTextNode(user.username);
    let span = document.createElement('span');
    span.className = "badge bg-primary rounded-spill";
    span.innerHTML = user.status;
    li.appendChild(userName);
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