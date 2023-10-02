const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    // const hashedPassword = await bcrypt.hash(password, 12);
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = new User({
      email: email,
      password: hashedPassword
    });
    const result = await user.save();
    res.status(200).json({
      message: 'User Created!',
      result: result
    });

  } catch (err) {
    res.status(500).json({
      message: 'Invalid authentication credentials!'
    });
  }
}

exports.login = async (req, res, next) => {
  try {
    const fetchedUser = await User.findOne({ email: req.body.email })
    if (!fetchedUser) {
      // return res.status(401).json({
      //   message: 'Auth failed'
      // });
      throw new Error('Auth failed');
    }
    const isEqual = await bcrypt.compare(req.body.password, fetchedUser.password);
    if (!isEqual) {
      // return res.status(401).json({
      //   message: 'Auth failed'
      // })
      throw new Error('Auth failed');
    }
    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600, // 3600 secound = 1hr.
      userId: fetchedUser._id
    });
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid authentication credentials!'
    });
  }
}
