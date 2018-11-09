const express = require('express');
const asyncMiddleware = require('../utils/async-middleware');
const graph = require('../db/credit-network-graph');
const generateRandomUser = require('../services/generate-random-user');

const router = express.Router();

/* GET /network/users */
router.get('/users', asyncMiddleware(async (req, res) => {
  const users = await graph.listUsers();
  res.render('network/users', { users });
}));

/* POST user */
router.post('/users', asyncMiddleware(async (req, res) => {
  const user = await generateRandomUser();
  await graph.createUser(user);
  res.redirect('/network/users');
}));

module.exports = router;
