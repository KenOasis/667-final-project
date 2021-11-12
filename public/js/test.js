// test script for game initial routes

const test1 = () => {
  const url = "http://" + location.host + "/game/initial"
  body = {
    game_id: 5,
    users_id: [2,6,4,9]
  }

  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    headers: new Headers({
      'content-type' : 'application/json'
    })
  }).then(response => response.json())
  .then(results => {
    console.log(results.status);
  }).catch(err => console.log(err));
}


const test2 = () => {
  const url = "http://" + location.host + "/game/load"
  body = {
    game_id: 5,
  }

  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    headers: new Headers({
      'content-type' : 'application/json'
    })
  }).then(response => response.json())
  .then(results => {
    let game_state = results.game_state;
    console.log(game_state);
  }).catch(err => console.log(err));
}