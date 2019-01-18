const express = require('express');
const asyncMiddleware = require('../utils/async-middleware');
const connections = require('../repositories/connections-repository');

const router = express.Router();

/* GET */
router.get('/', asyncMiddleware(async (req, res) => {
  const userConnections = await connections.findByUserId(req.user.id);
  res.render('users/connections/connections-index', {
    user: req.user,
    connections: userConnections,
  });
}));

module.exports = router;
