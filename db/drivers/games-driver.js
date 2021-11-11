const db = require('../../models/');
const Games = db['games'];

exports.createGame = async (name) => {
  try {
    const user = await Games.create(
      {
        name
      }
    );

    return user;
    
  } catch (err) {
    console.error(err);
    return null;
  }
}