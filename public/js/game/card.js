"use strict"
let CardModule = {
    cards: [{
        card_id: [1],
        card_color: "red",
        card_type: "number",
        card_value: "zero"
    }, {
        card_id: [2],
        card_color: "yellow",
        card_type: "number",
        card_value: "zero"
    }, {
        card_id: [3],
        card_color: "green",
        card_type: "number",
        card_value: "zero"
    }, {
        card_id: [4],
        card_color: "blue",
        card_type: "number",
        card_value: "zero"
    }, {
        card_id: [5, 6],
        card_color: "red",
        card_type: "number",
        card_value: "one"
    }, {
        card_id: [7, 8],
        card_color: "yellow",
        card_type: "number",
        card_value: "one"
    }, {
        card_id: [9, 10],
        card_color: "green",
        card_type: "number",
        card_value: "one"
    }, {
        card_id: [11, 12],
        card_color: "blue",
        card_type: "number",
        card_value: "one"
    }, {
        card_id: [13, 14],
        card_color: "red",
        card_type: "number",
        card_value: "two"
    }, {
        card_id: [15, 16],
        card_color: "yellow",
        card_type: "number",
        card_value: "two"
    }, {
        card_id: [17, 18],
        card_color: "green",
        card_type: "number",
        card_value: "two"
    }, {
        card_id: [19, 20],
        card_color: "blue",
        card_type: "number",
        card_value: "two"
    }, {
        card_id: [21, 22],
        card_color: "red",
        card_type: "number",
        card_value: "three"
    }, {
        card_id: [23, 24],
        card_color: "yellow",
        card_type: "number",
        card_value: "three"
    }, {
        card_id: [25, 26],
        card_color: "green",
        card_type: "number",
        card_value: "three"
    }, {
        card_id: [27, 28],
        card_color: "blue",
        card_type: "number",
        card_value: "three"
    }, {
        card_id: [29, 30],
        card_color: "red",
        card_type: "number",
        card_value: "four"
    }, {
        card_id: [31, 32],
        card_color: "yellow",
        card_type: "number",
        card_value: "four"
    }, {
        card_id: [33, 34],
        card_color: "green",
        card_type: "number",
        card_value: "four"
    }, {
        card_id: [35, 36],
        card_color: "blue",
        card_type: "number",
        card_value: "four"
    }, {
        card_id: [37, 38],
        card_color: "red",
        card_type: "number",
        card_value: "five"
    }, {
        card_id: [39, 40],
        card_color: "yellow",
        card_type: "number",
        card_value: "five"
    }, {
        card_id: [41, 42],
        card_color: "green",
        card_type: "number",
        card_value: "five"
    }, {
        card_id: [43, 44],
        card_color: "blue",
        card_type: "number",
        card_value: "five"
    }, {
        card_id: [45, 46],
        card_color: "red",
        card_type: "number",
        card_value: "six"
    }, {
        card_id: [47, 48],
        card_color: "yellow",
        card_type: "number",
        card_value: "six"
    }, {
        card_id: [49, 50],
        card_color: "green",
        card_type: "number",
        card_value: "six"
    }, {
        card_id: [51, 52],
        card_color: "blue",
        card_type: "number",
        card_value: "six"
    }, {
        card_id: [53, 54],
        card_color: "red",
        card_type: "number",
        card_value: "seven"
    }, {
        card_id: [55, 56],
        card_color: "yellow",
        card_type: "number",
        card_value: "seven"
    }, {
        card_id: [57, 58],
        card_color: "green",
        card_type: "number",
        card_value: "seven"
    }, {
        card_id: [59, 60],
        card_color: "blue",
        card_type: "number",
        card_value: "seven"
    }, {
        card_id: [61, 62],
        card_color: "red",
        card_type: "number",
        card_value: "eight"
    }, {
        card_id: [63, 64],
        card_color: "yellow",
        card_type: "number",
        card_value: "eight"
    }, {
        card_id: [65, 66],
        card_color: "green",
        card_type: "number",
        card_value: "eight"
    }, {
        card_id: [67, 68],
        card_color: "blue",
        card_type: "number",
        card_value: "eight"
    }, {
        card_id: [69, 70],
        card_color: "red",
        card_type: "number",
        card_value: "nine"
    }, {
        card_id: [71, 72],
        card_color: "yellow",
        card_type: "number",
        card_value: "nine"
    }, {
        card_id: [73, 74],
        card_color: "green",
        card_type: "number",
        card_value: "nine"
    }, {
        card_id: [75, 76],
        card_color: "blue",
        card_type: "number",
        card_value: "nine"
    }, {
        card_id: [77, 78],
        card_color: "red",
        card_type: "action",
        card_value: "skip"
    }, {
        card_id: [79, 80],
        card_color: "red",
        card_type: "action",
        card_value: "reverse"
    }, {
        card_id: [81, 82],
        card_color: "red",
        card_type: "action",
        card_value: "draw_two"
    }, {
        card_id: [83, 84],
        card_color: "yellow",
        card_type: "action",
        card_value: "skip"
    }, {
        card_id: [85, 86],
        card_color: "yellow",
        card_type: "action",
        card_value: "reverse"
    }, {
        card_id: [87, 88],
        card_color: "yellow",
        card_type: "action",
        card_value: "draw_two"
    }, {
        card_id: [89, 90],
        card_color: "green",
        card_type: "action",
        card_value: "skip"
    }, {
        card_id: [91, 92],
        card_color: "green",
        card_type: "action",
        card_value: "reverse"
    }, {
        card_id: [93, 94],
        card_color: "green",
        card_type: "action",
        card_value: "draw_two"
    }, {
        card_id: [95, 96],
        card_color: "blue",
        card_type: "action",
        card_value: "skip"
    }, {
        card_id: [97, 98],
        card_color: "blue",
        card_type: "action",
        card_value: "reverse"
    }, {
        card_id: [99, 100],
        card_color: "blue",
        card_type: "action",
        card_value: "draw_two"
    }, {
        card_id: [101, 102, 103, 104],
        card_color: "none",
        card_type: "wild",
        card_value: "wild"
    }, {
        card_id: [105, 106, 107, 108],
        card_color: "yellow",
        card_type: "wild",
        card_value: "wild_draw_four"
<<<<<<< HEAD:public/js/card.js
    }],

    /* this functuin request the card_id and respone
     card detail in object
     {
         card
     }
     */

    get_card_detail(id) {
        let card_info = this.cards.filter(card => card.card_id.includes(id));
        return card_info[0];
    },

    getNumber(face_value) {
        switch (face_value) {
            case 'zero':
                return 0;
            case 'one':
                return 1;
            case 'two':
                return 2;
            case 'three':
                return 3;
            case 'four':
                return 4;
            case 'five':
                return 5;
            case 'six':
                return 6;
            case 'seven':
                return 7;
            case 'eight':
                return 8;
            case 'nine':
                return 9;
            default:
                return;
        }
    },

    card_url_generator(id) {
        let card_detail = this.get_card_detail(id);
        let type = card_detail.card_type;
        let color = card_detail.card_color;
        let value = card_detail.card_value;
        let loca = "/images/uno_cards/";
        switch (type) {
            case 'wild':
                return loca + value + ".jpg";
            case 'action':
                return loca + type + '-' + color + '-' + value + ".jpg";
            case 'number':
                return loca + type + '-' + color + '-' + this.getNumber(value) + ".jpg";
            default:
                return loca + "back.jpg";
        }

    }

}
=======
    }
],
get_card_detail(id){
    let card_info = this.cards.filter(card => card.card_id.includes(id));
    return card_info;
}
}

>>>>>>> 86da878dc69fadd8bca3b4f530ecbd5af8261d73:public/js/game/card.js
