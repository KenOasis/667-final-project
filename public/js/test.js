const test = () => {
  const url = "http://" + location.host + "/game/initial"
  body = {
    game_id: 7,
    users_id: [2,3,4,7]
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
    console.log(results.message);
  }).catch(err => console.log(err));
}