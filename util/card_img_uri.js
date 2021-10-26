const getNumber = (face_value) => {
    switch (face_value){
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
}

const cardURIGenerator = (type, color, face_value, action) => {
    switch (type){
        case 'wild':
            return action;
        case 'action':
            return type + '-' + color + '-' + action;
        case 'number': 
            return type + '-' + color + '-' + getNumber(face_value);
        default:
            return 'back';
    }
}

module.exports = cardURIGenerator;