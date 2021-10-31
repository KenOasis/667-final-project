const username = document.getElementById('username');
const email = document.getElementById('email');
const pw = document.getElementById('password');
const confirmPW = document.getElementById('confirmPassword');
const feedback_username = document.getElementById("feedback_username");
const feedback_email = document.getElementById("feedback_email");
const feedback_pw = document.getElementById("feedback_pw");
const feedback_confirmPW = document.getElementById("feedback_confirmPW");

const username_regex = /^(?=.*\d)(|.*[a-z])(|.*[A-Z])[0-9+a-zA-Z]{3,}$/; // atleast 3 alphanumerical chars
const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const pw_regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const username_validation = ()=>{
    if(username_regex.test(username)){
        feedback_username.style.display = "none";
    }
    else{
        feedback_username.innerHTML = "Username must be atleast 3 alphanumerical characters long"
        feedback_username.style.display = "inherit";
    }
}
const email_validation = ()=>{
    if(email_regex.test(email)){
        feedback_email.style.display = "none";
    }
    else{
        feedback_email.innerHTML = "Email is invalid";
        feedback_email.style.display = "inherit";

    }
}
const pw_validation = ()=>{
    if(pw_regex.test(pw)){
        feedback_pw.style.display = "none";
    }
    else{
        feedback_pw.innerHTML = "must be length >= 8, contain number, letter and special character";
        feedback_pw.style.display = "inherit";
    }
}
const confirmPW_validation = ()=>{
    if(pw.value === confirmPW.value){
        feedback_confirmPW.style.display = "none";
    }
    else{
        feedback_confirmPW.innerHTML = "password does not match";
        feedback_confirmPW.style.display = "inherit";
    }
}
const mountEventListeners = ()=>{
    username.addEventListener('input', username_validation);
    email.addEventListener('input', email_validation);
    pw.addEventListener('input', pw_validation);
}
mountEventListeners();