## Server side Testing

### Setup Steps

1. Clone down this repo

1. run `npm i`

1. Create a database called `tv-shows`

```sh
$ createdb tv_shows
```

1. Run the knex migrations and seed

```sh
$ knex migrate: latest -env development
$ knex seed:run
```

<!-- 1. Get the first tests to pass -->

## Blog Post

### Intro

Today, we'll be going over server-side testing. Up until this point, in order to test our routes, we've been using cURL and Postman. As useful as these tools are, it can become a real pain to be constantly using these to check if our routes are doing what we want them to. Today I will be going over how we can use server side testing to automate that process, and make things much easier to test.

We will be using [Mocha](http://mochajs.org/) as our test runner, and [Chai](http://chaijs.com/guide/) as our assertion library.

### Folder Structure

Firstly, let's look at the folder structure. You'll see that in the root of our project, we have a folder called `test`. The way chai works is that it looks for this folder called test, and then runs all the files within it. You can [change the test directory](http://stackoverflow.com/questions/10753288/how-to-specify-test-directory-for-mocha) if you want to, and specify a `mocha.opts` file to tell mocha where to look for those tests, but today we'll just be using the default.

### apiTest file requires

In our `apiTest.js` file, let's break down what's going on in the setup section.

```js
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server/app');

var should = chai.should();

chai.use(chaiHttp);
```

The first line requires `chai`, our assertion library. This gives us access to the chai object, and we can change the syntax with which we write our tests. Then we require `chai-http`. This module allows us make http requests from within our test file. Finally, we need a link to our app file. This is where any requests coming from our tests go to, and from there we can hit any of our routes, and see what get's returned.

For today, I will be using the [should](http://chaijs.com/guide/styles/#should) style for my tests. Note that you can also use [expect](http://chaijs.com/guide/styles/#expect) or [assert](http://chaijs.com/guide/styles/#assert). These are simpy different ways of writing the same tests.

Lastly, we tell chai to use `chaiHttp` so that we can make these http requests to our server.

### The first test

Here is the first test:

```js
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
```

We have our first `describe` block, to get all shows. Within that block, we have a single `it` statement. Let's break down the first statement.


```js
it('should get all shows', function(done) {
    chai.request(server)
    .get('/api/shows')
    .end(function(err, res) {

        done();
    });
});
```

By removing all of the test conditions, we can just look at the structure of this request. Within the function, we have a callback, `done`. Because we are making requests to a server, we need some way of telling the function when the requests are finished. So we use a callback once the request has ended, and we have a response.

In order to make a request to our server, we use `chai.request(server)`. Because of this line, we don't need to actually be running our server to run these tests. Mocha will actually do all of this for us. Remember that the variable `server` refers to our `app.js` file. So mocha mocks out our running server, and then sends it the request we specify in the next line. `.get('/api/shows')` means send a get request to the endpoint `/api/shows` I wil be going through the rest of the CRUD actions later on, but you can specify what type of request you want to send through here. (e.g. post/put/delete). Finally, we have our `.end` function with a callback, with 'err' and 'res'. So we now have access to the response objects coming back from our request, and we can test out what these are.

### Our Assertions

```js
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
```

The first thing we generally want to do, is test that the response has a status of 200. After that, these tests will change depending on what you want back from your route. In this case, we are expecting json back. We expect that the response will be an array, as we are 'getting ALL shows', we want that length to equal 4, as there are 4 items in the database. Then after that, we can actually start testing out the values within the array, and making sure that they are equal to what's actually in our database.

##



