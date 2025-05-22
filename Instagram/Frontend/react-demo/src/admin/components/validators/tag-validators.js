
const minLengthValidator = (value, minLength) => {
    return value.length >= minLength;
};

const requiredValidator = value => {
    return value.trim() !== '';
};

const validate = (value, rules) => {
    let isValid = true;

    for (let rule in rules) {

        switch (rule) {
            case 'minLength': isValid = isValid && minLengthValidator(value, rules[rule]);
                break;

            case 'isRequired': isValid = isValid && requiredValidator(value);
                break;

            default: isValid = true;
        }

    }

    let firstCharacter = value.toString().substring(0, 1);
    // console.log(firstCharacter);
    if(firstCharacter !== '#'){
        isValid = false;
    }

    return isValid;
};

export default validate;