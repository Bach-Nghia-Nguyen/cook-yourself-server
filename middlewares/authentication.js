const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { AppError } = require("../helpers/utils.helper");

const authMiddleware = {};

authMiddleware.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    console.log("tokenString:", tokenString);

    if (!tokenString)
      return next(new AppError(401, "Login required", "Validation Error"));
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(new AppError(401, "Token expired", "Validation Error"));
        } else {
          return next(
            new AppError(401, "Token is invalid", "Validation Error")
          );
        }
      }
      // console.log(payload);
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};

authMiddleware.adminRequired = async (req, res, next) => {
  try {
    const userId = req.userId;
    const currentUser = await User.findById(userId);
    const isAdmin = currentUser.role === "admin";

    if (!isAdmin) return next(new Error("401 - You are not authorized"));
    req.isAdmin = isAdmin;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
