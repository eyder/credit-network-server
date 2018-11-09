const express = require('express');
const asyncMiddleware = require('../utils/async-middleware');
const graph = require('../db/credit-network-graph');

const router = express.Router();

/* GET */
router.get('/', asyncMiddleware(async (req, res) => {
  const connections = await graph.getUserConnections(req.user.id);
  res.render('users/connections/connections-index', {
    user: req.user,
    connections,
  });
}));

module.exports = router;
