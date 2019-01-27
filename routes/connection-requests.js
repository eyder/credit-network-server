const express = require('express');
const asyncMiddleware = require('../utils/async-middleware');
const connectionRequests = require('../repositories/connection-requests');
const users = require('../repositories/users');

const router = express.Router();

/* GET */
router.get('/', asyncMiddleware(async (req, res) => {
  const receivedReqs = await connectionRequests.findReceivedByUserId(req.user.id);
  const sentReqs = await connectionRequests.findSentByUserId(req.user.id);
  res.render('users/connection-requests/index', {
    user: req.user,
    receivedReqs,
    sentReqs,
  });
}));

/* GET find-person */
router.get('/find-person', asyncMiddleware(async (req, res) => {
  const others = await users.findUsersNotRelatedTo(req.user.id);
  res.render('users/connection-requests/find-person', {
    user: req.user,
    others,
  });
}));

/* GET confirm */
router.get('/to/:otherId/confirm', asyncMiddleware(async (req, res) => {
  const other = await users.findById(req.params.otherId);
  res.render('users/connection-requests/confirm', {
    user: req.user,
    other,
  });
}));

/* POST */
router.post('/to/:otherId', asyncMiddleware(async (req, res) => {
  const other = await users.findById(req.params.otherId);
  await connectionRequests.create(req.user.id, other.id);
  res.redirect(`/users/${req.user.id}`);
}));

module.exports = router;
