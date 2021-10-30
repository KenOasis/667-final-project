const feedback_current = document.getElementById('feedback_current');
const feedback_new = document.getElementById('feedback_new');
const feedback_confirm = document.getElementById('feedback_confirm');

const input_current = document.getElementById('current_password');
const input_new = document.getElementById('new_password');
const input_confirm = document.getElementById('confirm_password');
const liveToast = document.getElementById('profileToast');

// Minimum eight characters, at least one letter, one number and one special character
const regexPassword = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);

const currentValidation = () => {
  if(regexPassword.test(input_current.value)) {
    feedback_current.style.display = "none"
  } else {
    feedback_current.innerHTML = "must be length >= 8, contain number, letter and special character"
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
    feedback_new.innerHTML = "must be length >= 8, contain number, letter and special character"
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

const onSubmitPasswordChange = () => {

  const url = "http://" + location.host + "/auth/change_password"
  const body = {
    current_password: input_current.value,
    new_password: input_new.value,
    confirm_password: input_confirm.value
  };
  if (onSubmitValidation()) {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      credentials: 'include',
      headers: new Headers({
        'content-type' : 'application/json'
      })
    }).then(response => response.json())
    .then(results => {
      if(results.errors) {
        console.log(results.errors);
        /* under validation failed, it returns an json object
          errors: [{
            value: "..",
            msg: "what-caused-the-validation-failed",
            param: "which-field-failed",
            location: "body"
          }]
        */
        if(liveToast) {
          let errors = results.errors;
          let errorMsg = `Field: ${errors[0].param} ;${errors[0].msg}`;
          document.getElementById('errors_message').innerHTML = errorMsg
          var toast = new bootstrap.Toast(liveToast);
          toast.show()
        }
      } else {
        // success!
        document.getElementById('errors_message').innerHTML = "Successfully change the password!"
          var toast = new bootstrap.Toast(liveToast);
          toast.show()
      }
    })
    .catch(err => console.error(err));
  } else {
    // do nothing
  }
}