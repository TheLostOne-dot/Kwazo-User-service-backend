const { verifySignUp, authJwt } = require("../middleware/middleware.index");
const controller = require("../controllers/auth.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    next();
  });
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkPasswordLength,
    ],
    controller.signup
  );
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signout", [authJwt.verifyToken], controller.signout);
  app.delete(
    "/api/auth/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};
