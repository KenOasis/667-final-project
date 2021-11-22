const userDriver = require("../db/drivers/user-driver");
const gameUsersDriver = require("../db/drivers/game-users-driver");
const bcrpyt = require("bcrypt");
const saltround = 11;
const url = require("url");

exports.signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  let existedUser = null;

  try {
    // checked whether the username already existed in db

    existedUser = await userDriver.findUserByName(username);

    if (existedUser !== null) {
      return res.status(409).json({
        errors: [
          {
            param: "username",
            msg: username + " already exists!",
          },
        ],
      });
    }

    // checked whether the email already existed in db

    existedUser = await userDriver.findUserByEmail(email);

    if (existedUser !== null) {
      return res.status(409).json({
        errors: [
          {
            param: "email",
            msg: "Email already exists!",
          },
        ],
      });
    }
    let hashPassword = await bcrpyt.hash(password, saltround);

    let newUser = await userDriver.signupUser(username, email, hashPassword);

    if (newUser === null) {
      throw new Error("DB data error.");
    }
    return res.status(200).json({
      url: url.format({
        pathname: "/transition",
        query: {
          title: "Successfully signup!",
          description: "Congratulation! You have successfully signed up.",
          redirect_path: "/login",
          page_name: "Login",
        },
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    let user = await userDriver.findUserByName(username);
    if (user !== null) {
      let hashPassword = user.password;
      let comparedResult = await bcrpyt.compare(password, hashPassword);
      if (comparedResult) {
        req.session.isLoggedIn = true;
        req.session.userId = user.id;
        req.session.userName = user.username;
        return res.status(200).json({
          url: url.format({
            pathname: "/transition",
            query: {
              title: "Successfully signup!",
              description: "Congratulation! You have successfully logged in.",
              redirect_path: "/lobby",
              page_name: "Game Lobby",
            },
          }),
        });
      } else {
        return res.status(401).json({
          errors: [
            {
              param: "password",
              msg: "Entered password is wrong",
            },
          ],
        });
      }
    } else {
      return res.status(401).json({
        errors: [
          {
            param: "username",
            msg: "Username does not exist!",
          },
        ],
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid").status(200).render("transition", {
      isLoggedIn: false,
      title: "Successfully logged out!",
      description: " You have successfully been logged out.",
      redirectPath: "/",
      redirectPageName: "Home",
    });
  });
};

exports.changePassword = async (req, res, next) => {
  const { userId } = req.session;
  const { current_password, new_password } = req.body;
  try {
    const user = await userDriver.findUserById(userId);

    if (user !== null) {
      let hashPassword = user.password;
      let comparedResult = await bcrpyt.compare(current_password, hashPassword);
      if (comparedResult) {
        user.password = await bcrpyt.hash(new_password, saltround);
        user.save();
        res.status(200).json({ status: "success" });
      } else {
        res.status(401).json({
          errors: [
            {
              msg: "Your current password is not corrected",
              param: "current_password",
            },
          ],
        });
      }
    } else {
      throw new Error("DB data error.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
};

exports.getProfile = async (req, res, next) => {
  const { userId } = req.session;
  try {
    let results = await gameUsersDriver.getGameUsersByUserId(userId);

    let profileImg = `/images/profile/profile${
      Math.floor(Math.random() * 3) + 1
    }.gif`;

    if (results && results.length) {
      const gamePlayed = results.length;
      const game_won = results.filter((element) => element.points > 0).length;
      const winrate = (game_won / gamePlayed) * 100;
      const lostrate = 100 - winrate;
      const points = results
        .map((element) => element.points)
        .reduce((previousPoint, currentPoint) => previousPoint + currentPoint);

      res.status(200).render("profile", {
        username: results[0].username,
        email: results[0].email,
        profileImg: profileImg,
        gamePlayed: gamePlayed,
        winrate: winrate,
        lostrate: lostrate,
        points: points,
      });
    } else if (results.length === 0) {
      let user = await userDriver.findUserById(userId);
      res.status(200).render("profile", {
        username: user.username,
        email: user.email,
        profileImg: profileImg,
        gamePlayed: 0,
        winrate: 100,
        lostrate: 0,
        points: 0,
      });
    } else {
      throw new Error("db error");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error.",
    });
  }
};
