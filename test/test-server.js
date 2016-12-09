const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

let server;

// create server afresh before each test in this module
beforeEach(function() {
  server = require('../server');
});

// tear down server between each test in this module
afterEach(function() {
  server.close();
});

describe('Recipes', () => {
  it('should list recipes on GET', done => {
    chai.request(server)
    .get('/recipes')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');

      response.body.length.should.be.at.least(1);

      const expectedKeys = ['id', 'name', 'ingredients'];
      response.body.forEach(item => {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys)
      });
      done();
    });
  });

  it ('should update a recipe on PUT', done => {
    chai.request(server)
    .get('/recipes')
    .end((error, response) => {
      const updated = {
        name: 'General Tso\'s Chicken',
        ingredients: ['Chicken', 'Awesome Sauce', 'Broccoli'],
        id: response.body[0].id
      };
      chai.request(server)
      .put(`/recipes/${response.body[0].id}`)
      .send(updated)
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.deep.equal(updated);
      });
    });
    done();
  });

  it ('should delete a recipe on DELETE', done => {
    chai.request(server)
    .get('/recipes')
    .end((error, response) => {
      chai.request(server)
      .delete(`recipes/${response.body[0].id}`)
      .end((error, response) => {
        response.should.have.status(204)
      });
      done();
    });

  });

  it('should add an recipe on POST', done => {
    const newRecipe = {name: 'bread', ingredients: ['flour', 'yeast', 'sugar', 'butter']}
    chai.request(server)
    .post('/recipes')
    .send(newRecipe)
    .end((error, response) => {
      response.should.have.status(201);
      response.should.be.json;
      response.body.should.be.a('object');
      response.body.should.include.keys('id', 'name', 'ingredients');
      response.body.id.should.not.be.null;
      response.body.should.deep.equal(Object.assign(newRecipe, {id: response.body.id}));
    });
    done();
  });
});

describe('Shopping List', function() {

  it('should list items on GET', function(done) {
    chai.request(server)
      .get('/shopping-list')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');

        // because we create three items on app load
        res.body.length.should.be.at.least(1);
        // each item should be an object with key/value pairs
        // for `id`, `name` and `checked`.
        const expectedKeys = ['id', 'name', 'checked'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
        done();
      });
  });

  it('should add an item on POST', function(done) {
    const newItem = {name: 'coffee', checked: false};
    chai.request(server)
      .post('/shopping-list')
      .send(newItem)
      .end(function(err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'checked');
        res.body.id.should.not.be.null;
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
        res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
      done();
  });

  it('should update items on PUT', function(done) {
    chai.request(server)
      // first have to get so we have an idea of object to update
      .get('/shopping-list')
      .end(function(err, res) {
        const updated = {
          name: 'foo',
          checked: true,
          id: res.body[0].id
        };
        chai.request(server)
          .put(`/shopping-list/${res.body[0].id}`)
          .send(updated)
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.deep.equal(updated);
          });
      })
      done();
  });

  it('should delete items on DELETE', function(done) {
    chai.request(server)
      // first have to get so we have an `id` of item
      // to delete
      .get('/shopping-list')
      .end(function(err, res) {
        chai.request(server)
          .delete(`/shopping-list/${res.body[0].id}`)
          .end(function(err, res) {
            res.should.have.status(204);
          });
      })
      done();
  });
});