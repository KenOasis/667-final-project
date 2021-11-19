const ChallengeAction = require("./Actions/ChallengeAction");
const DrawCardAction = require("./Actions/DrawCardAction");
const DrawTwoAction = require("./Actions/DrawTwoAction");
const PlayCardAction = require("./Actions/PlayCardAction");
const ReverseAction = require("./Actions/ReverseAction");
const SkipAction = require("./Actions/SkipAction");
const UnoAction = require("./Actions/UnoAction");
const UnoPenaltyAction = require("./Actions/UnoPenaltyAction");
const WildAction = require("./Actions/WildAction");
const WildDrawFourAction = require("./Actions/WildDrawFourAction");

const checkParams = (paramsObj, objParams) => {
  for (param of objParams) {
    if (!paramsObj.hasOwnProperty(param)) {
      return `Missing property "${param}" in the params`;
    }
  }
  return true;
};

class ActionFactory {
  /**
   *
   * @param {string} type of the action
   * @param {object} params an object contain the corresponded type of params of the action
   */
  create(type, params) {
    switch (type) {
      case "challenge": {
        const check = checkParams(params, ChallengeAction.getParams());
        if (check === true) {
          const {
            performer,
            is_challenged,
            is_success,
            penalty_player,
            penalty_count,
            penalty_cards,
            receiver,
          } = params;
          return new ChallengeAction(
            performer,
            is_challenged,
            is_success,
            penalty_player,
            penalty_count,
            penalty_cards,
            receiver
          ).action();
        } else {
          throw new Error(check);
        }
      }
      case "draw_card": {
        const check = checkParams(params, DrawCardAction.getParams());
        if (check === true) {
          const { performer, card, receiver } = params;
          return new DrawCardAction(performer, card, receiver).action();
        } else {
          throw new Error(check);
        }
      }
      case "draw_two": {
        const check = checkParams(params, DrawTwoAction.getParams());
        if (check === true) {
          const { performer, cards, receiver } = params;
          return new DrawTwoAction(performer, cards, receiver).action();
        } else {
          throw new Error(check);
        }
      }
      case "play_card": {
        const check = checkParams(params, PlayCardAction.getParams());
        if (check === true) {
          const { performer, card } = params;
          return new PlayCardAction(performer, card).action();
        } else {
          throw new Error(check);
        }
      }
      case "reverse": {
        const check = checkParams(params, ReverseAction.getParams());
        if (check === true) {
          const { performer } = params;
          return new ReverseAction(performer).action();
        } else {
          throw new Error(check);
        }
      }
      case "skip": {
        const check = checkParams(params, SkipAction.getParams());
        if (check === true) {
          const { performer } = params;
          return new SkipAction(performer).action();
        } else {
          throw new Error(check);
        }
      }
      case "uno": {
        const check = checkParams(params, UnoAction.getParams());
        if (check === true) {
          const { performer } = params;
          return new UnoAction(performer).action();
        } else {
          throw new Error(check);
        }
      }
      case "uno_penalty": {
        const check = checkParams(params, UnoPenaltyAction.getParams());
        if (check === true) {
          const { performer, cards, receiver } = params;
          return new UnoPenaltyAction(performer, cards, receiver).action();
        } else {
          throw new Error(check);
        }
      }
      case "wild": {
        const check = checkParams(params, WildAction.getParams());
        if (check === true) {
          const { performer, color } = params;
          return new WildAction(performer, color).action();
        } else {
          throw new Error(check);
        }
      }
      case "wild_draw_four": {
        const check = checkParams(params, WildDrawFourAction.getParams());
        if (check === true) {
          const { performer, color } = params;
          return new WildDrawFourAction(performer, color).action();
        } else {
          throw new Error(check);
        }
      }
      default: {
        throw new Error(
          `Wrong action type, the options are one of belows:
            ${this.getActionTypes().join(" | ")} 
          `
        );
      }
    }
  }

  getActionTypes() {
    return [
      "challenge",
      "draw_card",
      "draw_two",
      "play_card",
      "reverse",
      "skip",
      "uno",
      "uno_penalty",
      "wild",
      "wild_draw_four",
    ];
  }
}

module.exports = new ActionFactory();

// test code
// const factory = new ActionFactory();
// params = {
//   performer: 1,
//   color: "red",
// };

// const action = factory.create("wild_draw_four", params);

// console.log(action);
