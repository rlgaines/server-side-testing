var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server/app');
var knex = require('../db/knex');

var should = chai.should();

chai.use(chaiHttp);

describe('API routes', function() {

    beforeEach(function(done) {
        knex.migrate.rollback().then(function() {
            knex.migrate.latest()
            .then(function() {
                return knex.seed.run().then(function() {
                    done()
                })
            })
        });
    })

  /*  afterEach(function(done) {
        knex.migrate.rollback().then(function() {
            done();
        });
    });*/

    describe('Get all shows', function() {

        it('should get all shows', function(done) {
            chai.request(server)
            .get('/api/shows')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.equal(4);
                res.body[0].should.have.property('name');
                res.body[0].name.should.equal('Suits');
                res.body[0].should.have.property('channel');
                res.body[0].channel.should.equal('USA Network');
                res.body[0].should.have.property('genre');
                res.body[0].genre.should.equal('Drama');
                res.body[0].should.have.property('rating');
                res.body[0].rating.should.equal(3);
                res.body[0].should.have.property('explicit');
                res.body[0].explicit.should.equal(false);
                done();
            });
        });
    });

    describe('post single show', function() {

        it('should POST a show', function(done) {
            chai.request(server)
            .post('/api/shows')
            .send({
                name: 'new show',
                channel : 'ABC',
                genre: 'Anything',
                rating: 1,
                explicit: false
            })
            .end(function(err, res) {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
        });
    })

    describe('edit single show', function() {

     it('should edit a show', function(done) {
            chai.request(server)
            .put('/api/show/1')
            .send({
                name: 'Edited Suits',
                channel : 'testing'
            })
            .end(function(err, res) {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                chai.request(server)
                .get('/api/show/1')
                .end(function(error, response) {
                    console.log(response.body);
                    done()
                });
            });
        });
    });

    describe('delete a show', function() {
        it('should edit a show', function(done) {
            chai.request(server)
            .delete('/api/show/1')
            .end(function(err, res) {
                console.log(res.body);
                res.should.have.status(200);
                res.should.be.json;
                chai.request(server)
                .get('/api/shows')
                .end(function(error, response) {
                    console.log(response.body);
                    done()
                });
            });
        });
    })

});


