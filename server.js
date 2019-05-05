/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const users = require('./routes/api/users');
const login = require('./routes/login');
const signup = require('./routes/signup');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const DB_URL = require('./config/keys').mongoURI;

mongoose
  .connect(process.env.DB_URL || DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

app.use(cookieParser());
app.use('/api/users', users);
app.use('/login', login);
app.use('/signup', signup);

const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port}`);
