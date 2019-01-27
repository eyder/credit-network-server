const express = require('express');
const asyncMiddleware = require('../utils/async-middleware');
const users = require('../repositories/users');
const generateRandomUser = require('../services/generate-random-user');

const router = express.Router();

/* GET /network/users */
router.get('/users', asyncMiddleware(async (req, res) => {
  const allUsers = await users.findAll();
  res.render('network/users', { users: allUsers });
}));

/* POST user */
router.post('/users', asyncMiddleware(async (req, res) => {
  const user = await generateRandomUser();
  await users.create(user);
  res.redirect('/network/users');
}));

module.exports = router;
