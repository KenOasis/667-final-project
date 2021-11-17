const username = document.getElementById("username");
const email = document.getElementById("email");
const pw = document.getElementById("password");
const confirmPW = document.getElementById("confirmPassword");
const liveToast = document.getElementById("signupToast");

const feedback_username = document.getElementById("feedback_username");
const feedback_email = document.getElementById("feedback_email");
const feedback_pw = document.getElementById("feedback_pw");
const feedback_confirmPW = document.getElementById("feedback_confirmPW");

const username_regex = /^(?=.*\d)(|.*[a-z])(|.*[A-Z])[0-9+a-zA-Z]{3,20}$/; // atleast 3 alphanumerical chars
const email_regex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const pw_regex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,256}$/;

const username_validation = () => {
  if (username_regex.test(username.value)) {
    feedback_username.style.display = "none";
  } else {
    feedback_username.innerHTML =
      "Username must be at least 3 alphanumerical characters long max-length 20";
    feedback_username.style.display = "inherit";
  }
};
const email_validation = () => {
  if (email_regex.test(email.value)) {
    feedback_email.style.display = "none";
  } else {
    feedback_email.innerHTML = "Email is invalid";
    feedback_email.style.display = "inherit";
  }
};
const pw_validation = () => {
  if (pw_regex.test(pw.value)) {
    feedback_pw.style.display = "none";
  } else {
    feedback_pw.innerHTML =
      "must be length >= 8, contain number, letter and special character";
    feedback_pw.style.display = "inherit";
  }
};
const confirmPW_validation = () => {
  if (pw.value === confirmPW.value) {
    feedback_confirmPW.style.display = "none";
  } else {
    feedback_confirmPW.innerHTML = "password does not match";
    feedback_confirmPW.style.display = "inherit";
  }
};
const mountEventListeners = () => {
  username.addEventListener("input", username_validation);
  email.addEventListener("input", email_validation);
  pw.addEventListener("input", pw_validation);
  confirmPW.addEventListener("input", confirmPW_validation);
};
mountEventListeners();

const onSubmitValidation = () => {
  let validateUsername = username_regex.test(username.value);
  let validateEmail = email_regex.test(email.value);
  let validatePW = pw_regex.test(pw.value);
  let validateConfirmPW = pw.value === confirmPW.value;

  if (validateUsername && validateEmail && validatePW && validateConfirmPW) {
    return true;
  } else return false;
};
const onSubmitSignup = () => {
  const url = "http://" + location.host + "/user/signup";
  const body = {
    username: username.value,
    email: email.value,
    password: pw.value,
    confirm_password: confirmPW.value,
  };

  if (onSubmitValidation()) {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: new Headers({
        "content-type": "application/json",
      }),
    })
      .then((response) => response.json())
      .then((results) => {
        if (results.errors) {
          if (liveToast) {
            let errors = results.errors;
            let errorMsg = `<b class="text-danger">{${errors[0].param}} : ${errors[0].msg}</b>`;
            document.getElementById("errors_message").innerHTML = errorMsg;
            var toast = new bootstrap.Toast(liveToast);
            toast.show();
          }
        } else {
          // success
          if (results.url) {
            window.location.href = results.url;
          }
        }
      })
      .catch((err) => {
        if (liveToast) {
          let errorMsg = `<b class="text-danger">${err.name} : ${err.message}/b>`;
          document.getElementById("errors_message").innerHTML = errorMsg;
          var toast = new bootstrap.Toast(liveToast);
          toast.show();
        } else {
          console.log(err);
        }
      });
  }
};
