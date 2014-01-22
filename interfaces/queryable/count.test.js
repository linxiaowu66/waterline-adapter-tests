var Waterline = require('waterline'),
    Model = require('./support/crud.fixture'),
    assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  /////////////////////////////////////////////////////
  // TEST SETUP
  ////////////////////////////////////////////////////

  var User,
      waterline;

  before(function(done) {
    waterline = new Waterline();
    waterline.loadCollection(Model);

    Events.emit('fixture', Model);
    Connections.queryable = _.clone(Connections.test);

    waterline.initialize({ adapters: { wl_tests: Adapter }, connections: Connections }, function(err, colls) {
      if(err) return done(err);
      User = colls.collections.user;
      done();
    });
  });

  after(function(done) {
    waterline.teardown(done);
  });

  describe('count()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    // Start with an known database state to accurately test count
    before(function(done) {
      User.destroy(function(err) {
        if(err) return done(err);

        // Insert 10 Users
        var users = [];
        for(var i=0; i<10; i++) {
          users.push({first_name: 'count_user' + i, type: 'count'});
        }

        User.createEach(users, function(err, users) {
          if(err) return done(err);
          done();
        });
      });
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should accurately count records', function(done) {
      User.count({ type: 'count' }, function(err, count) {
        assert(!err);
        assert(count === 10);
        done();
      });
    });

    it('should work with dynamic finders', function(done) {
      User.countByType('count', function(err, count) {
        assert(!err);
        assert(count === 10);
        done();
      });
    });

  });
});
