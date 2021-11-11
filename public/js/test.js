// test script for game initial routes

const test = () => {
  const url = "http://" + location.host + "/game/initial"
  body = {
    game_id: 5,
    users_id: [1,6,4,3]
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