const Action = require('./Action');

class WildDrawFourAction extends Action{
  
  constructor(performer, color) {
    super(performer);
    this._type = "wild_draw_four";
    this._color = color;
  }

  action() {
    return {
      performer: this._performer,
      type: this._type,
      color: this._color
    }
  }
}

module.exports = WildDrawFourAction;