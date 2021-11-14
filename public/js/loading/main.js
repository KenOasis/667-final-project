const game_id = document.getElementById("game_id").value;
const userJoin = (userList) => {
  let counter = 1;
  console.log(userList);
  userList.forEach(user => {
    const profileImg = document.getElementById(`profile-${counter}`);
    profileImg.src = `/images/profile/profile${counter}.gif`;
    const nameDiv = document.getElementById(`name-${counter}`);
    nameDiv.innerHTML = user.username;
    counter++;
  });
  const progressDiv = document.getElementById('progress');
  progressDiv.style = `width: ${(userList.length / 4) * 100}%`;
  progressDiv.innerHTML = `${(userList.length / 4) * 100}%`
  if (userList.length === 4) {
    // start game HERE!
  }
}
