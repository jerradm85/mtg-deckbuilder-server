const express = require("express");
const AuthService = require("./auth-service");
const authRouter = express.Router();
const requireAuth = require('../middleware/jwt-auth')
const jsonParser = express.json();

authRouter.post("/login", jsonParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const loginUser = { user_name, password };

  // validates that the request body contains the required credentials
  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  // uses the user_name credential value to find a user from the database
  AuthService.getUserWithUserName(req.app.get("db"), loginUser.user_name)
    .then((dbUser) => {
      if (!dbUser)
        return res.status(400).json({
          error: "Incorrect user_name or password",
        });

      // If a user is found by that posted username, the password credential
      // is validated against the bcrypted password in the database, by using bcrypt compare
      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: "Incorrect user_name or password",
          });

        const sub = dbUser.user_name;
        const payload = { user_id: dbUser.id };

        // if everything is good, an auth token is responded
        res.send({
          authToken: AuthService.createJwt(sub, payload),
        });
      });
    })
    .catch(next);
});

// authRouter.post('/refresh', requireAuth, (req, res) => {
//   const sub = req.user.user_name
//   const payload = { user_id: req.user.id }
//   res.send({
//     authToken: AuthService.createJwt(sub, payload),
//   })
// })

module.exports = authRouter;
