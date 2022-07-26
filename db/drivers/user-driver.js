const db = require("../../models/");
const Users = db["users"];

exports.findUserByName = async (username) => {
  try {
    const user = await Users.findOne({
      where: {
        username,
      },
    });

    return user;
  } catch (error) {
    throw error;
  }
};

exports.findUserByEmail = async (email) => {
  try {
    const user = await Users.findOne({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    throw error;
  }
};

exports.findUserById = async (user_id) => {
  try {
    const user = await Users.findByPk(user_id);

    return user;
  } catch (error) {
    throw error;
  }
};

/* values is an object with key : value pair for insert
  {
    username: "jackson"
    password: "19023858asda@!#",
    email: "jy419023@gmail.com"
  }
*/
exports.signupUser = async (username, email, password) => {
  try {
    const user = await Users.create({
      username,
      email,
      password,
    });

    return user;
  } catch (error) {
    throw error;
  }
};
