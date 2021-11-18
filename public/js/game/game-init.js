
const host = location.host;
const socket = io(host + "/game");
// this is the user_list
const user_list = JSON.parse(document.getElementById("user_list").value);

const player_profile={
    set_user(html_id, user){
        const profile = document.getElementById(html_id);
        const detail = profile.getElementsByClassName("name")[0];
        detail.innerText=user.username;
        detail.id="user_"+user.user_id.toString();     
    },
    set_user_name(game_order_list, user){
        console.log(user.username);
        const position = game_order_list.indexOf(user.user_id);
        console.log(position);
        if(position == 1){
            this.set_user("left_user",user);
        }
        if(position == 2){
            this.set_user("top_user", user);
        }
        if(position == 3){
            this.set_user("right_user",user);
        }
        // switch(position){
        //     case 1:
        //         this.set_user("left_user",user);
        //     case 2:
        //         this.set_user("top_user", user);
        //     case 3:
        //         this.set_user("right_user",user);
        //     default:
        //         return
        // }

    }

}

const loadGameState = () => {
  const url = "http://" + location.host + "/game/loadgamestate";
  const body = {
    game_id: user_list[0].game_id,
  };
  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .then((response) => response.json())
    .then((results) => {
      if (results.status === "success") {
          const game_state = results.game_state;
          console.log(game_state)
          const game_class = new game_state_helper(game_state);
          const game_order=game_class.arrange_players();
          console.log(user_list)
          console.log(game_order)
          for(let i = 0 ;i < game_order.length ;i++){
            player_profile.set_user_name(game_order,user_list[i])
          }
          game_class.set_players_location()
          setTimeout(function(){
            game_class.set_game_state_to_page()
          },2000)
      } else {
        console.log(resulst.status + " : " + results.message);
      }
    })
    .catch((error) => console.log(error));
};

loadGameState();