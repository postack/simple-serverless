var addCar                 = require('./handler').addCar
var getCar              = require('./handler').getCar
var cars              = require('./handler').cars
var TestUtils             = require('./modules/TestUtils.utils');

var assert      = require('chai').assert;
var should      = require('chai').should();

describe("Cars tests", function () {
  
  before(function(done){
    this.timeout(50000);
    TestUtils.mockDB().then(function(data){
      done();
    })
    .catch(function(err){
      assert(false,"Could not create the mock DB")
      done();
    });
  });

  beforeEach(function(done) {

    done()
  })

  it('should insert the car and then get it', function() {
    return new Promise((resolve, reject) => {
      const car = JSON.stringify({ name: 'New Orleans', brand: 'Estados Unidos' });
      const event = {
        body: car,
        requestContext: { authorizer: { claims: { sub: 'some user id', 'cognito:groups': ['Backend'] }} }
      }
      const eventGet = {
        pathParameters: { code: 'neworleans'}
      }
      const context = {};
      const callback = (ctx, data) => {
        const car = JSON.parse(data.body);
        assert(data.statusCode === 200, 'status code should be 200')
        assert(car.name === 'New Orleans', 'car complete name')
        assert(car.brand === 'Estados Unidos', 'brand complete name')
        assert(car.code === 'neworleans', 'car complete code')
        assert(car.brandCode === 'estadosunidos', 'brand complete code')
        resolve()
      }
      addCar(event, {}, (ctx, data)=> {
        const car = JSON.parse(data.body);
        assert(data.statusCode === 200, 'status code should be 200')
        assert(car.name === 'New Orleans', 'car complete name')
        assert(car.brand === 'Estados Unidos', 'brand complete name')
        assert(car.code === 'neworleans', 'car complete code')
        assert(car.brandCode === 'estadosunidos', 'brand complete code')
        console.log('getting car again')
        getCar(eventGet, context, callback)
      })
    })
    
  })


  it('should be able to insert the car if there is repeated', function() {
    return new Promise((resolve, reject) => {
      const car = JSON.stringify();
      const event = {
        body: JSON.stringify({ name: 'New Orleans', brand: 'Estados Unidos' }),
        requestContext: { authorizer: { claims: { sub: 'some user id', 'cognito:groups': ['Backend']  }} }
      }
      const context = {};
      const callback = (ctx, data) => {
        const res = JSON.parse(data.body).error
        if(data.statusCode == 200){
          resolve(data);
        }
        else{
          reject(data);
        }
        
      }
      addCar(event, {}, (ctx, data)=> {
        addCar(event, context, callback)
      })
    })
    
  })

  it.skip('should not be able to insert the car if the token does not have a group', function() {
    return new Promise((resolve, reject) => {
      const car = JSON.stringify();
      const event = {
        body: JSON.stringify({ name: 'New Orleans', brand: 'Estados Unidos' }),
        requestContext: { authorizer: { claims: { sub: 'some user id' }} }
      }
      const context = {};
      const callback = (ctx, data) => {
        const res = JSON.parse(data.body)
        if(data.statusCode == 200){
          reject(data);
        }
        else{
          assert(res.error === 'notAuthorized', 'Error should be "notAuthorized"')
          resolve(data);
        }
        
      }
      addCar(event, {}, (ctx, data)=> {
        addCar(event, context, callback)
      })
    })
    
  })

  it('should not be able to insert the car no brand is passed', function() {
    return new Promise((resolve, reject) => {
      const event = {
        body: JSON.stringify({ name: 'New Orleans2' }),
        requestContext: { authorizer: { claims: { sub: 'some user id', 'cognito:groups': ['Backend'] }} }
      }
      const context = {};
      const callback = (ctx, data) => {
        const res = JSON.parse(data.body).error
        console.log('RESPONSE', res)
        if(data.statusCode == 200){
          reject(data);
        }
        else{
          assert(res.error === 'noName', 'Error should be "noName"')
          resolve(data);
        }
        
      }
      addCar(event, {}, callback)
    })
    
  })
  
});