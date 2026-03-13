const User = require('../models/user.schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
const registeredUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Registering user:', { name, email });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log('User saved:', savedUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: savedUser,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not register user',
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Authorization failed, user not found',
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // generate token
    const jwttoken = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWTSECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      token: jwttoken,
      userId: user._id,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// FIND ONE USER
const findOneUser = async (req, res) => {
  const { email } = req.body;
  console.log('Finding user by email:', email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User found',
      data: user,
    });
  } catch (error) {
    console.error('Error finding user:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not find user',
    });
  }
};

module.exports = {
  registeredUser,
  login,
  findOneUser,
};
