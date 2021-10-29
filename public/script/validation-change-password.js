const feedback_current = document.getElementById('feedback_current');
const feedback_new = document.getElementById('feedback_new');
const feedback_confirm = document.getElementById('feedback_confirm');

const input_current = document.getElementById('password');
const input_new = document.getElementById('new_password');
const input_confirm = document.getElementById('confirm_password');


// Minimum eight characters, at least one letter, one number and one special character
const regexPassword = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);

const currentValidation = () => {
  if(regexPassword.test(input_current.value)) {
    feedback_current.style.display = "none"
  } else {
    feedback_current.innerHTML = "length >= 8, contain number, letter and special character"
    feedback_current.style.display = "inherit";
  }
}

const confirmValidation = (event) => {
  if(input_new.value === input_confirm.value) {
    feedback_confirm.style.display = "none";
  } else {
    feedback_confirm.innerHTML = "Not match with the new password";
    feedback_confirm.style.display = "inherit";
  }
}

const newValidation = (event) => {
  if(regexPassword.test(input_new.value)) {
    feedback_new.style.display = "none"
  } else {
    feedback_new.innerHTML = "length >= 8, contain number, letter and special character"
    feedback_new.style.display = "inherit";
  }
  if (input_confirm.value !== null) {
    confirmValidation();
  }
}



const loadEventListeners = () => {
  input_current.addEventListener('input', currentValidation);
  input_new.addEventListener('input', newValidation);
  input_confirm.addEventListener('input', confirmValidation);
}

loadEventListeners();


const onSubmitValidation = () => {
  let validateCurrent = regexPassword.test(input_current.value); 
  let validateNew = regexPassword.test(input_new.value);
  let validateConfirm = (input_new.value === input_confirm.value);

  if (validateCurrent && validateNew && validateConfirm) {
    return true;
  } else {
    return false;
  }
}
const onSubmitPasswordChange = (event) => {
  event.preventDefault();
  if (onSubmitValidation) {
    console.log('success');
    // fetch
  } else {
    // do nothing
  }
}