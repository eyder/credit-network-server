var express = require('express');

var router = express.Router();

var graph = require('../db/credit-network-graph');

/* GET */
router.get('/', function(req, res, next) {
  graph.getReceivedConnectionRequests(req.user.id)
  .then(receivedReqs => req.receivedReqs = receivedReqs)
  .then(() => graph.getSentConnectionRequests(req.user.id))
  .then(sentReqs => {
    res.render('users/connection-requests/connection-requests-index', {
      user: req.user,
      sentReqs: sentReqs,
      receivedReqs: req.receivedReqs
    });
  })
  .catch(next);
});

/* GET find-person */
router.get('/find-person', function(req, res, next) {
  graph.listUsersNotRelatedTo(req.user.id)
  .then(others => {
    res.render('users/connection-requests/find-person', {
      user: req.user,
      others: others
    });
  })
  .catch(next);
});

/* GET define-limit */
router.get('/to/:otherId/define-limit', function(req, res, next) {
  graph.getUser(req.params.otherId)
  .then(other =>
    res.render('users/connection-requests/define-limit', {
      user: req.user,
      other: other
    })
  )
  .catch(next);
});

/* POST */
router.post('/to/:otherId', function(req, res, next) {
  graph.getUser(req.params.otherId)
  .then(other => graph.createConnectionRequest(req.user.id, other.id, req.body.limit))
  .then(request => {
    res.redirect('/users/' + req.user.id);
  })
  .catch(next);
});

module.exports = router;
