const constructUserList = (user_list) => {
  const usersDiv = document.getElementById("users");
  usersDiv.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    if (i < user_list.length) {
      const topDiv = document.createElement("div");
      topDiv.className = "col-3";
      topDiv.style = "width: 240px";
      const cardDiv = document.createElement("div");
      cardDiv.className = "card border border-success";
      const imgDiv = document.createElement("img");
      imgDiv.className = "card-img";
      imgDiv.src = `/images/profile/profile${i + 1}.gif`;
      const overlayDiv = document.createElement("div");
      overlayDiv.className = "card-img-overlay";
      userNameDiv = document.createElement("h5");
      userNameDiv.className = "card-title";
      userNameDiv.innerHTML = user_list[i].username;
      overlayDiv.appendChild(userNameDiv);
      cardDiv.appendChild(imgDiv);
      cardDiv.appendChild(overlayDiv);
      topDiv.appendChild(cardDiv);
      usersDiv.appendChild(topDiv);
    } else {
      const topDiv = document.createElement("div");
      topDiv.className = "col-3";
      topDiv.style = "width: 240px";
      const cardDiv = document.createElement("div");
      cardDiv.className = "card border border-success";
      const emptySlotDiv = document.createElement("div");
      emptySlotDiv.style = "width: 214px; height: 214px;";
      cardDiv.appendChild(emptySlotDiv);
      topDiv.appendChild(cardDiv);
    }
  }
};
