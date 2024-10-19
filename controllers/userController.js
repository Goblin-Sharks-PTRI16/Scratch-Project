const db = require('../models/goalAppModels');
const userController = {};

userController.getAllUsers = async (req, res, next) => {
  try {
    const result = await db.query(`SELECT * FROM users;`);
    // console.log('result:', result.rows);
    res.locals.users = result.rows;
    return next();
  } catch (err) {
    const errorObj = {
      log: `userController.getAllUsers: ERRORS: ${err.message}`,
      message: {
        err: 'userController.getAllUsers: ERROR: Failed to retrieve characters',
      },
    };
    return next(errorObj);
  }
};

userController.login = async (req, res, next) => {
  const { id: userId } = req.body.userInfo;
  
  // console.log(`goodle id `, userId);
  const queryText = `SELECT * FROM users WHERE username = $1;`;
    // console.log(queryText);
  try {
      const results = await db.query(queryText, [userId]);
      // console.log('results in login:',results)
    if (results.rows.length === 0) {
      const insertText = 'INSERT INTO users (username) VALUES ($1) RETURNING *';
      const insertResults = await db.query(insertText, [userId]);
      res.locals.login = insertResults.rows[0];
      // console.log(`insert results`, res.locals.login);
      req.session.userId = insertResults.rows[0].id;
            console.log(`New user inserted and logged in:`, res.locals.login);
    } else {
      // User exists, handle login (you can return user data if needed)
      // User exists, handle login
      const existingUser = results.rows[0];
      console.log('existing user',existingUser)
      // Store user info in res.locals for further use
      res.locals.login = existingUser;

      // Save the user's ID in the session
      req.session.userId = existingUser.username;
      console.log(`User logged in:`, res.locals.login);
      console.log(`Session started for user ID: ${req.session.userId}`);

    }

    return next();
  } catch (err) {
    const errorObj = {
      log: `userController.login: ERRORS: ${err.message}`,
      message: {
        err: 'userController.login: ERROR: Failed to login',
      },
    };
    return next(errorObj);
  }
};

// userController.signUp = async(req, res, next) => {
//     const { username, password, email } = req.body;

// }

module.exports = userController;
