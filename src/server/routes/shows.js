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
  Shows().select().where('id', req.params.id).then(function(result){
    res.status(200).json(result);
  });
});

//post request
router.post('/shows', function(req, res, next){
	var show = req.body
	// console.log(res.body)
	Shows().insert(req.body).returning('id').then(function(result){

    res.status(200).json(result);
  });
})
module.exports = router;
