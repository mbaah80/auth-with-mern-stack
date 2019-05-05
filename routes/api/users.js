const express = require('express');
const Joi = require('@hapi/joi');

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Modal
const User = require('../../models/user');
const secret = require('../../config/keys').jwtSecret;

// @route GET api/users
// @desc Get list of users
// @access Public
router.get('/', (req, res) => {
  User.find()
    .sort({
      createdAt: -1,
    })
    .then(users => res.json(users));
});

function authenticate(req, res, next) {
  const accessToken = req.headers.authorization;
  if (accessToken) {
    const token = accessToken.split(' ')[1];
    req.token = token;
    next();
  } else {
    res.status(403).json({ success: false, message: 'You are not logged in!' });
  }
}

// @route DELETE api/users/:id
// @desc Delete a user
// @access Protected
router.delete('/:id', authenticate, (req, res) => {
  jwt.verify(req.token, secret, (_, payload) => {
    if (payload.id !== req.params.id) {
      res.status(403).json({ success: false, message: 'Invalid User' });
    } else {
      User.findById(req.params.id)
        .then(user => user.remove().then(() => res.json({
          success: true,
        })))
        .catch(() => res.status(404).json({
          success: false,
        }));
    }
  });
});

const saltRounds = 10;
// @route UPDATE api/users/:id
// @desc Update A User
// @access Protected
router.put('/:id', authenticate, (req, res) => {
  jwt.verify(req.token, secret, (error, payload) => {
    if (payload.id !== req.params.id) {
      res.status(403).json({ success: false, message: 'Invalid User' });
    } else {
      bcrypt.hash(req.body.password, saltRounds, (_, hash) => {
        const schema = Joi.object().keys({
          name: Joi.string()
            .min(2)
            .max(30),
          email: Joi.string()
            .trim()
            .email(),
          username: Joi.string()
            .alphanum()
            .min(3)
            .max(30),
          password: Joi.string().regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
          ),
        });
        Joi.validate(req.body, schema, { abortEarly: false }, (err) => {
          if (err) {
            res.json({
              success: false,
              message: err.details.map(msg => msg.message.replace(/\\"/g, '').replace(/"/g, '')),
            });
            return;
          }
          const updatedUser = {
            ...(req.body.name && { name: req.body.name }),
            ...(req.body.username && { username: req.body.username }),
            ...(req.body.email && { email: req.body.email }),
            ...(req.body.password && { password: hash }),
          };
          User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: updatedUser },
            { new: true },
            () => {
              if (error) {
                return res.status(404).json({
                  success: false,
                });
              }
              return res.status(201).json({
                success: true,
              });
            },
          );
        });
      });
    }
  });
});

module.exports = router;
