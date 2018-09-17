import { SERVER_ERROR, getHeaders } from './utils';
const Cars = require('./modules/Cars')


module.exports.cars = (event, context, callback) => { 
  const cars = new Cars()
  
  try {
    cars.getAll()
      .then(cars => {
        const response = {
          statusCode: 200,
          headers: getHeaders(),
          body: JSON.stringify(cars)
        }
        callback(null, response)
      })
      .catch(err => {
        const response = {
          statusCode: 409,
          body: JSON.stringify({
            message: 'Could not get cars',
            error: err,
          })
        };

        callback(null, response);
      })
    }catch(e) { callback(null, SERVER_ERROR(e)) }
}

module.exports.getCar = (event, context, callback) => {
  const cars = new Cars()
  try {
    const code = event.pathParameters.code;
    console.log('HANDLER CODE', code)
    cars.get(code)
      .then(car => {
        const response = {
          statusCode: 200,
          headers: getHeaders(),
          body: JSON.stringify({ ...car })
        }
        callback(null, response)
      })
      .catch(err => {
        const response = {
          statusCode: 404,
          body: JSON.stringify({
            message: 'Could not get car',
            error: err,
          })
        };
        callback(null, response);
      })
  }catch(e) { callback(null, SERVER_ERROR(e)) }
}

module.exports.addCar = (event, context, callback) => {
  const cars = new Cars()
  try {
    /*const claims = event.requestContext.authorizer ? event.requestContext.authorizer.claims : null;
    console.log('EVENT', JSON.stringify(event.requestContext.authorizer))
    if(!claims) {
      throw 'notToken';
    }
    const groups = claims['cognito:groups'];
    if(!groups || groups.indexOf('Backend') < 0) {
      throw 'notAuthorized'
    }*/
    cars.add(JSON.parse(event.body))
      .then(car => {
        const response = {
          statusCode: 200,
          headers: getHeaders(),
          body: JSON.stringify({ ...car })
        }
        callback(null, response)
      })
      .catch(err => {
        const response = {
          statusCode: 402,
          body: JSON.stringify({
            message: 'Could not add car',
            error: err,
          })
        };
        callback(null, response);
      })
  }catch(e) { callback(null, SERVER_ERROR(e)) }
}