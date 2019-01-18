const express = require('express');
const asyncMiddleware = require('../utils/async-middleware');
const repository = require('../repositories/users-repository');
const generateRandomUser = require('../services/generate-random-user');

const router = express.Router();

/* GET /network/users */
router.get('/users', asyncMiddleware(async (req, res) => {
  const users = await repository.findAll();
  res.render('network/users', { users });
}));

/* POST user */
router.post('/users', asyncMiddleware(async (req, res) => {
  const user = await generateRandomUser();
  await repository.create(user);
  res.redirect('/network/users');
}));

module.exports = router;
