var express = require('express');
var router = express.Router();

var networks = require('../repositories/networks');
var users = require('../repositories/users');

var usersRouter = require('./users');


/* GET /networks */
router.get('/', function(req, res, next) {
  res.render('networks', { networks:  networks });
});

/* GET /networks/:id */
router.get('/:networkId', function(req, res, next) { 
  const network = networks.find(network => network.id == req.params.networkId);
  const networkUsers = users.filter(user => user.networkId == network.id);
  res.render('network', { network: network, users: networkUsers });
});

/* METHOD /networks/:id/users */
router.use('/:networkId/users', function(req, res, next) { 
    req.networkId = req.params.networkId;
    next();
}, usersRouter);

module.exports = router;
