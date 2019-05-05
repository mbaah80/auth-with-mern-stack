/* eslint-disable no-param-reassign */
const express = require('express');
const Joi = require('@hapi/joi');

const router = express.Router();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

// User Modal
const User = require('../models/user');
const secret = require('../config/keys').jwtSecret;

const saltRounds = 10;

// @route POST /signup
// @desc Create a new user
// @access Public
router.post('/', (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (_, hash) => {
    const schema = Joi.object().keys({
      name: Joi.string()
        .min(2)
        .max(30)
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case 'any.empty':
                err.message = 'Value should not be empty!';
                break;
              case 'string.min':
                err.message = `Value should have at least ${err.context.limit} characters!`;
                break;
              case 'string.max':
                err.message = `Value should have at most ${err.context.limit} characters!`;
                break;
              default:
                break;
            }
          });
          return errors;
        }),
      email: Joi.string()
        .trim()
        .email()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case 'any.empty':
                err.message = 'Value should not be empty!';
                break;
              case 'string.email':
                err.message = 'Entered email is not a valid email!';
                break;
              default:
                break;
            }
          });
          return errors;
        }),
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case 'string.alphanum':
                err.message = 'Username must only contain alpha-numeric characters!';
                break;
              case 'string.min':
                err.message = `Value should have at least ${err.context.limit} characters!`;
                break;
              case 'string.max':
                err.message = `Value should have at most ${err.context.limit} characters!`;
                break;
              default:
                break;
            }
          });
          return errors;
        }),
      password: Joi.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)
        .required()
        .error(() => 'Password must atleast 8 characters long and must have atleast one lower-case, one upper-case, one symbols and one digit.'),
    });
    Joi.validate(req.body, schema, { abortEarly: false }, (err) => {
      if (err) {
        res.json({
          success: false,
          message: err.details.map(msg => msg.message.replace(/\\"/g, '').replace(/"/g, '')),
        });
        return;
      }
      const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });
      newUser.save()
        .then((user) => {
          jwt.sign(
            { id: user._id },
            process.env.SECRET || secret,
            { expiresIn: 60 * 60 * 24 * 7 },
            (error, token) => {
              if (error) res.status(500).json({ error: 'Error signing token', raw: error });
              res.json({
                success: true,
                token: `Bearer ${token}`,
                user,
              });
            },
          );
        })
        .catch(() => res.status(404).json({
          success: false,
          message: 'Could not save user!',
        }));
    });
  });
});

module.exports = router;
