const express = require('express');
const asyncMiddleware = require('../utils/async-middleware');
const connectionRequests = require('../repositories/connection-requests-repository');
const users = require('../repositories/users-repository');

const router = express.Router();

/* GET */
router.get('/', asyncMiddleware(async (req, res) => {
  const receivedReqs = await connectionRequests.findReceivedByUserId(req.user.id);
  const sentReqs = await connectionRequests.findSentByUserId(req.user.id);
  res.render('users/connection-requests/connection-requests-index', {
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

/* GET define-limit */
router.get('/to/:otherId/define-limit', asyncMiddleware(async (req, res) => {
  const other = await users.findById(req.params.otherId);
  res.render('users/connection-requests/define-limit', {
    user: req.user,
    other,
  });
}));

/* POST */
router.post('/to/:otherId', asyncMiddleware(async (req, res) => {
  const other = await users.findById(req.params.otherId);
  await connectionRequests.create(req.user.id, other.id, req.body.limit);
  res.redirect(`/users/${req.user.id}`);
}));

module.exports = router;
