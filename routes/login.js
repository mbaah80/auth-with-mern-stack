const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

// User Modal
const User = require('../models/user');
const secret = require('../config/keys').jwtSecret;

// @route GET api/users
// @desc Get list of users
// @access Public
router.post('/', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      const userPwd = user.password;
      bcrypt.compare(password, userPwd, (err, isValid) => {
        if (isValid) {
          const payload = {
            // eslint-disable-next-line no-underscore-dangle
            id: user._id,
          };
          jwt.sign(payload, process.env.SECRET || secret, { expiresIn: 60 * 60 * 24 * 7 }, (error, token) => {
            if (error) res.status(500).json({ error: 'Error signing token', raw: error });
            res.json({
              success: true,
              token: `Bearer ${token}`,
              user,
            });
          });
          return;
        }
        res.status(404).json({
          success: false,
          message: 'Username or password is incorrect!',
        });
      });
    })
    .catch(() => res.status(404).json({
      success: false,
      message: 'User not found!',
    }));
});

module.exports = router;
