class Action {
  constructor(performer) {
    this._performer = performer;
    this._type = "action";
  }

  action() {
    return {
      performer: this._performer,
      type: this._type,
    };
  }
}

module.exports = Action;
