var express = require('express');

var router = express.Router();

var graph = require('../db/credit-network-graph');

var generateRandomUser = require('../services/generate-random-user');

/* GET /network/users */
router.get('/users', function(req, res, next) {
  graph.listUsers()
  .then(users => res.render('network/users', { users: users }))
  .catch(next);
});

/* POST user */
router.post('/users', function(req, res, next) {
  generateRandomUser()
  .then(user => graph.createUser(user))
  .then(() => res.redirect('/network/users'))
  .catch(next);
});

module.exports = router;
