var express = require('express');
var router = express.Router();
var knex = require('../../../db/knex');

function Shows() {
    return knex('shows');
};

// router.get('/shows', function(req, res, next) {
//   res.status(200).json('testing');
// });

router.get('/shows', function(req, res, next) {
  // res.status(200).json('testing');
  Shows().select().then(function(result){
    res.status(200).json(result);
  });
});


//single route
router.get('/show/:id', function(req, res, next) {
  // res.status(200).json('testing');
  Shows().select(req.body.id).then(function(result){
    res.status(200).json(result);
  });
});

//post request
router.post('/shows', function(req, res, next){
	// console.log(req.body)
	// console.log(res.body)
	Shows().insert(req.body).then(function(result){
    res.status(200).json(result);
  });
	console.log(res.body)
})
module.exports = router;
