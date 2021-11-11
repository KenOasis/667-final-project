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

  get cardDeck() {
    return this.cardDeck;
  }

  get gameDirection() {
    return this.game_direction;
  }

  get gameOrder() {
    return this.game_order;
  }

  get currentPlayer() {
    return this.current_player;
  }

  get matching() {
    return this.matching;
  }

  get players() {
    return this.players;
  }

  get discards() {
    return this.discards;
  }
}

module.exports = GameState;