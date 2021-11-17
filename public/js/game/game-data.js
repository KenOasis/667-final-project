
// fetch game_state
function game_init(){
    const url = "http://" + location.host + "/game/game_state";
    fetch(url)
    .then(response => response.json())
    .then(results =>{
        const game_state = results.game_state;
        const game_helper = new game_state_helper(game_state);
        game_helper.game_init();
        game_helper.show_discard();
    }
    )
    .catch(err => console.log(err))
}
game_init()

// adding event to card