const shuffle = (array) => {
  let currentIndex = array.length;
  let randomIndex;
  let shuffleArray = array.slice(0);
  // While there remain elements to shuffle
  while (currentIndex != 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element
    [shuffleArray[currentIndex], shuffleArray[randomIndex]] = [
      shuffleArray[randomIndex],
      shuffleArray[currentIndex],
    ];
  }

  return shuffleArray;
};

module.exports = shuffle;
