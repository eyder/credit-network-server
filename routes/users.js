var express = require('express');

var router = express.Router();
var connectionRequestsRouter = require('./connection-requests');

var users = require('../repositories/users');

var generateRandomUser = require('../services/generate-random-user');

/* POST user */
router.post('/', function(req, res, next) {
  generateRandomUser()
    .then(
      user => {
        user.networkId = req.network.id;
        users.push(user);
        res.redirect('/networks/' + req.network.id);
      }
    )
    .catch(next);
});

/* GET user */
router.get('/:userId', function(req, res, next) {
  const user = users.find(user => user.networkId == req.network.id && user.id == req.params.userId);
  res.render('users/user', { network: req.network, user: user });
});

/* NESTED ROUTES /networks/:id/users/:id/connection-requests */
router.use('/:userId/connection-requests', function(req, res, next) { 
  req.user = users.find(user => user.networkId == req.network.id && user.id == req.params.userId);  
  next();
}, connectionRequestsRouter);

module.exports = router;
