import dynalite from 'dynalite';
import AWS from 'aws-sdk';


var dynaliteServer = dynalite({createTableMs: 50});
var CARS_TABLE = require('./constants').CARS_TABLE;

module.exports.mockDB = () => {
  AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:4567"
  });

  var dynamodb = new AWS.DynamoDB();

  return new Promise((resolve, reject) => {
     dynaliteServer.listen(4567, function(err) {
       dynamodb.listTables({},function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        if(data.TableNames.length <= 0){
          dynamodb.createTable({
            TableName : CARS_TABLE,
            KeySchema: [
              { AttributeName: "code", KeyType: "HASH"},  //Partition key
              //{ AttributeName: "email", KeyType: "RANGE" }  //Sort key
            ],
            AttributeDefinitions: [
              { AttributeName: "code", AttributeType: "S" },
            ],
            ProvisionedThroughput: {
              ReadCapacityUnits: 1,
              WriteCapacityUnits: 1
            },
          },
          function(err, data) {
            if (err) {
              console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
              reject(err);
            } else {
            setTimeout(()=>{
              resolve(data);
            },1000)
            }
          });
         }
         else{ resolve(); }
      }
        });
    });
  });
}