const game_state={
    "cards_deck":45,
    "game_direction":"clockwise",
    "game_order":[1,9,6,12],
    "current_player":9,
    "matching":{
        "color":"green",
        "number":"nine"
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

 let card_tool ={

    sit_player(player_id, contianer_id){
       const leftseat= document.getElementById(contianer_id);
       const div=document.createElement('div');
       div.className="hand";
       div.id="player_"+player_id.toString();
       leftseat.appendChild(div);
   },
    set_cards(card_id){
       const card = document.createElement('div');
       const card_detail = CardModule.get_card_detail(card_id);
       card.id = "card_" + card_id.toString()
       if(card_detail.card_color === "none"){
           card.className=" card " + card_detail.card_value
       }
       else{
           card.className=" card " + card_detail.card_color + " " +card_detail.card_value
       }
       return card;
   },
    set_card_back(card_back){
       const card = document.createElement('div');
       if(card_back == "back"){
            card.className="card " + card_back;
       }
       else{
            card.className = card_back
       }
       return card;
   },

   card_to_player(player_id, card){
        const div = document.getElementById("player_" + player_id.toString());
        console.log(div)
        div.appendChild(card);
   }


   }
/**
 * left and right player setup
 * 
 */

class game_state_helper {
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
    find_matching_card(){
        const matching=this.game_state.matching;
        const bottom_player = this.find_bottom_player().cards;
        const match_list = bottom_player.filter(card => {
            const card_detail = CardModule.get_card_detail(card);
            if(matching.color === card_detail.card_color || matching.number === card_detail.card_value || card_detail.card_color === "none"){
                return card;
            }
        })
        return match_list;
    }
    get_discard_pile(){
        return this.game_state.discards;
    }
    show_top_bottom_card(player_id){
        const player_info = this.find_one_player(player_id);
        if("cards" in player_info){
            const cards = player_info.cards;
            for(let i in cards){
                console.log("bottom")
                console.log(cards[i])
                const card_html = card_tool.set_cards(cards[i]);
                card_tool.card_to_player(player_id,card_html);
            }
        }
        else{
            const number_cards = player_info.number_of_cards;
            console.log(number_cards)
            for(let i= 0 ; i < number_cards ; i++){
                const back_html = card_tool.set_card_back("back");
                console.log(back_html);
                card_tool.card_to_player(player_id,back_html);
            }

        }
    }
    show_left_right_card(player_id){
        const player_info = this.find_one_player(player_id);
        const number_of_card = player_info.number_of_cards;
        for(let i=0 ; i < number_of_card ; i++){
            const back_html =card_tool.set_card_back("cardcol");
            card_tool.card_to_player(player_id,back_html);
        }
    }
    game_init(){
        const order = this.arrange_players()
        card_tool.sit_player(order[0], "container_bottom");
        this.show_top_bottom_card(order[0]);
        console.log("left" + order[1])
        card_tool.sit_player(order[1], "container_left");
        this.show_left_right_card(order[1]);
        card_tool.sit_player(order[2], "container_top");
        this.show_top_bottom_card(order[2]);
        card_tool.sit_player(order[3], "container_right");
        this.show_left_right_card(order[3])
    }

    
}

const card = new game_state_helper(game_state);
card.game_init()




