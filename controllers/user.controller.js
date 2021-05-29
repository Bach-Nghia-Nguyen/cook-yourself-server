const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
// const emailHelper = require("../helpers/email.helper");
// const utilsHelper = require("../helpers/utils.helper");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  let { name, email, password, avatarUrl } = req.body;
  let user = await User.findOne({ email });
  if (user)
    return next(new AppError(400, "User already exists", "Registration Error"));

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  // const emailVerificationCode = utilsHelper.generateRandomHexString(20);

  user = await User.create({
    name,
    email,
    password,
    avatarUrl,
    //emailVerificationCode,
    //emailVerified: false,
  });
  // const accessToken = await user.generateToken();

  // const emailData = await emailHelper.renderEmailTemplate(
  //   "verify_email",
  //   { name: name },
  //   email
  // );

  // if (!emailData.error) {
  //   emailHelper.send(emailData);
  // } else {
  //   return next(new AppError(500, emailData.error, "Create Email Error"));
  // }

  return sendResponse(
    res,
    200,
    true,
    { user },
    null,
    "Create user successfully"
  );
});

userController.verifyEmail = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  let user = await User.findOne({ emailVerificationCode: code });

  if (!user) {
    return next(
      new AppError(400, "Invalid Verification Code", "Email Verification Error")
    );
  }

  user = await User.findByIdAndUpdate(
    user._id,
    { $set: { emailVerified: true }, $unset: { emailVerificationCode: 1 } },
    { new: true }
  );

  const accessToken = await user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successfully"
  );
});

userController.updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const allows = ["name", "avatarUrl"];
  let { password } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError(404, "Account not found", "Update Profile Error"));
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user["password"] = password;
    console.log("Encrypted new password:", password);
  }

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  return sendResponse(res, 200, true, user, null, "Update Profile success");
});

userController.getUsers = catchAsync(async (req, res, next) => {
  let { page, limit, sortBy, ...filter } = { ...req.query };

  // const currentUserId = req.userId;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const totalUsers = await User.countDocuments({ ...filter, isDeleted: false });
  const totalPages = Math.ceil(totalUsers / limit);
  const offset = limit * (page - 1);

  const users = await User.find(filter)
    .sort({ ...sortBy, createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { users, totalPages },
    null,
    "Get users success"
  );
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user)
    return next(new AppError(400, "User not found", "Get Current User Error"));

  return sendResponse(res, 200, true, user, null, "Get current user success");
});

module.exports = userController;
