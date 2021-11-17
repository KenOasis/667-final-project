const liveToast = document.getElementById("loginToast");

const onSubmitLogin = () => {
  const url = "http://" + location.host + "/user/login";
  const body = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };
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
};
