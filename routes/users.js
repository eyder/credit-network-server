var express = require('express');
var router = express.Router();

var networks = require('../repositories/networks');
var users = require('../repositories/users');

var generateRandomUser = require('../services/generate-random-user');

/* POST user */
router.post('/', function(req, res, next) { 
  const network = networks.find(network => network.id == req.networkId);
  generateRandomUser()
    .then(
      user => {
        user.networkId = network.id;
        users.push(user);
        res.redirect('/networks/' + network.id);
      }
    )
    .catch(next);
});

/* GET user */
router.get('/:userId', function(req, res, next) { 
  const network = networks.find(network => network.id == req.networkId);
  const user = users.find(user => user.networkId == network.id && user.id == req.params.userId);
  res.render('user', { network: network, user: user });
});

module.exports = router;
