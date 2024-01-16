const crud = require("../utils/crud");
const User = require("../models/user");
// const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

exports.signup = async (req, res, next) => {
  try {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;

    if (req.body.password.length < 8) {
      return res
        .status(403)
        .json({ message: "Password must be at least 8 characters long." });
    }

    if (
      req.body.password.toLowerCase().includes(name.toLowerCase()) ||
      req.body.password.toLowerCase().includes(surname.toLowerCase())
    ) {
      return res.status(403).json({
        message:
          "Your password should not contain your name or surname. Try to make it more secure...",
      });
    }

    const symbolPattern = /[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|~-]/;
    if (!symbolPattern.test(req.body.password)) {
      return res.status(403).json({
        message:
          "Your password should contain at least one symbol (special character).",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const checkExistence = await User.findOne({ email: email });

    if (checkExistence) {
      throw new Error("This user already exists.");
    }

    const createdUser = await User.create({
      name: name,
      surname: surname,
      email: email,
      password: hashedPassword,
    });

    res.status(201).json({
      operation: "User created!",
      userId: createdUser._id,
      email: createdUser.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    let loadedUser;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User could not be found.");
    }
    loadedUser = user;

    const pwCheck = await bcrypt.compare(req.body.password, user.password);
    if (!pwCheck) {
      throw new Error("Password is incorrect.");
    }

    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      config.get("jwtSecretKey"),
      { expiresIn: "24h" }
    );
    res.status(200).json({
      token: token,
      userId: loadedUser._id.toString(),
      name: loadedUser.name,
      surname: loadedUser.surname,
      profileImage: loadedUser.profileImage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = crud.getOne(User);
exports.updateUser = async (req, res, next) => {
  try {
    const newUpdate = req.body || {};
    if (req.body.password) {
      throw new Error("You cannot change password.");
    }
    if (req.file) {
      newUpdate.profileImage = req.file.path;
    }

    const updatedObject = await User.findByIdAndUpdate(
      req.params.id,
      newUpdate
    );
    if (!updatedObject) {
      return next(new GlobalError("Could not be found.", 404));
    }
    res.status(200).json({ operation: "Updated", data: updatedObject });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = crud.getAll(User);
