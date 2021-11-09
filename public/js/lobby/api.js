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
    // Nothing to do, message was sent by socket
  }).catch(err => console.log(err));
}

const joinGame = (event) => {
  const game_id = event.target.parentNode.parentNode.dataset.game_id;
  const url = "http://" + location.host + "/lobby/joinGame";
  const body = {
    game_id
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    headers: new Headers({
      'content-type' : 'application/json'
    })
  }).then(response => response.json())
  .then(result => {
    if (toastContainer) {
      const newToast = addToast(result.message);
      let toast = new bootstrap.Toast(newToast);
      toast.show(); 
    }
  })
  .catch(err => console.log(err));
}

const leaveGame = (event) => {
  const game_id = event.target.parentNode.parentNode.dataset.game_id;
  const url = "http://" + location.host + "/lobby/leaveGame";
  const body = {
    game_id
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    headers: new Headers({
      'content-type' : 'application/json'
    })
  }).then(response => response.json())
  .then(result => {
    if (toastContainer) {
      const newToast = addToast(result.message);
      let toast = new bootstrap.Toast(newToast);
      toast.show(); 
    }
  })
  .catch(err => console.log(err));
}

const reconnectGame = () => {
  // TODO
}