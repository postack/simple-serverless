const AWS = require('aws-sdk')
const CARS_TABLE = require('./constants').CARS_TABLE;
const uuidv4 = require('uuid/v4')
const Car = require('./Car')

class CarsTable {
  constructor (db, name) {
    const IS_OFFLINE = process.env.IS_OFFLINE;

    if (IS_OFFLINE === 'true') {
      console.log('IS OFFLINE')
      this.db = new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    } else {
      this.db = new AWS.DynamoDB.DocumentClient();
    };
    this.TABLE_NAME = CARS_TABLE
  }

  getCars() {
    const params = {
      TableName: this.TABLE_NAME,
      ScanIndexForward: true,
    }

    return this.db.scan(params)
      .promise()
      .then(data => data.Items.sort((a,b) => a.code < b.code))
  }

  addCar(_car) {
    const car = new Car(_car);
    const verification = car.verifyFields();
    const params = {
      TableName: this.TABLE_NAME,
      Item: {
        code: car.data.code,
        name: car.data.name,
        description1: [],
        description2: [],
        brand: car.data.brand,
        brandCode: car.data.brandCode,
      }
    }
    if(verification.error) { return new Promise((res) => { res(verification); }) }
    
    return this.db.put(params)
      .promise()
      .then((res) => car.data);
  }



  
  get(code) {
    const params = {
      TableName: this.TABLE_NAME,
      Key: {
        code,
      }
    }

    return this.db.get(params)
      .promise()
      .then(data => data.Item)
  }

}

module.exports = CarsTable
