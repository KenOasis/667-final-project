class GameState {
  constructor(game_state) {
    this.card_deck = game_state.card_deck;
    this.game_direction = game_state.game_direction;
    this.game_order = game_state.game_order;
    this.current_player = game_state.current_player;
    this.matching = game_state.matching;
    this.players = game_state.players;
    this.discards = game_state.discards;
  }

}