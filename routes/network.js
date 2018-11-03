const express = require('express');

const router = express.Router();

const graph = require('../db/credit-network-graph');

const generateRandomUser = require('../services/generate-random-user');

/* GET /network/users */
router.get('/users', (req, res, next) => {
  graph.listUsers()
    .then(users => res.render('network/users', { users }))
    .catch(next);
});

/* POST user */
router.post('/users', (req, res, next) => {
  generateRandomUser()
    .then(user => graph.createUser(user))
    .then(() => res.redirect('/network/users'))
    .catch(next);
});

module.exports = router;
