const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { Snowflake } = require("@theinternetfolks/snowflake");

//@desc Register a user
//@route POST /api/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password ) {
    return res.status(400).json({ message: "All fields are mandatory!" });

  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    return res.status(400).json({ message: "User already registered!" });

  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const id = Snowflake.generate();
  console.log(id)
  const user = await User.create({
    id,
    name,
    email,
    password: hashedPassword,

  });

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    return res.status(400).json({ message: "User data is not valid" });

  }
});

//@desc Login user
//@route POST /api/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});


module.exports = { registerUser, loginUser};