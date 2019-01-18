const express = require('express');
const asyncMiddleware = require('../utils/async-middleware');
const repository = require('../repositories/connections-repository');

const router = express.Router();

/* GET */
router.get('/', asyncMiddleware(async (req, res) => {
  const connections = await repository.findByUserId(req.user.id);
  res.render('users/connections/connections-index', {
    user: req.user,
    connections,
  });
}));

module.exports = router;
