const game_state={
    "cards_deck":45,
    "game_direction":"clockwise",
    "game_order":[1,9,6,12],
    "current_player":9,
    "matching":{
        "color":"green",
        "number":9
    },
    "players":[
        {
            "user_id":1,
            "uno":false,
            "number_of_cards":5
        },
        {
            "user_id":6,
            "uno":false,
            "number_of_cards":6},
        {
            "user_id":9,
            "uno":false,
            "cards":[102,21,17,65,15,54],
            "number_of_cards":7
        },
        {
            "user_id":12,
            "uno":true,
            "number_of_cards":1
        }],
                
        
    "discards":[94,25,28]
 }

/**
 * left and right player setup
 * 
 */

class game_init {
    constructor(game_state){
        this.game_state=game_state;
    }
    find_bottom_player(){
        const players = this.game_state.players;
        const bottom_player = players.filter(player=>{
            if("cards" in player ){
                return player
            }
        })
        return bottom_player[0]
    }
    arrange_players(){
        const order = this.game_state.game_order;
        const bottom_player = this.find_bottom_player().user_id;
        const cut = order.indexOf(bottom_player);
        const left =order.slice(cut,order.lenght);
        const right = order.slice(0,cut);
        const from_bottom_to_right= left.concat(right);
        return from_bottom_to_right;
    }
    find_one_player(id){
        const players= this.game_state.players;
        const player_info =players.filter(player => player.user_id === id)
        return player_info[0];
    }
    // find_matching_card(){
    //     const matching=this.game_state.matching;
    //     const bottom_player = this.find_bottom_player().cards;
    //     const match_list = bottom_player.filter(card => {
    //         const card_detail = CardModule.get_card_detail(card);
    //         if(card in card_detail.)
    //     })
    // }



}
// const player= new game_init(game_state)
// console.log(player.arrange_players())
// function sit_left_player(player_id, contianer_id){
//     const leftseat= document.getElementById(contianer_id);
//     const div=document.createElement('div');
//     div.className="hand";
//     div.id="player_"+player_id.toString();
//     leftseat.appendChild(div);
// }
// function find_bottom_player(){


// }
const card_detail = CardModule.get_card_detail(10);
console.log(card_detail)







