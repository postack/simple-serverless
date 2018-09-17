### Cars serverless module
This is a boilerplate project with a popular domain: Cars.
You will provide a way to add cars to a dynamo database. Every car has a brand.


sls dynamodb install
`npm install`

# create a config file
Replace `example.config.env.json` with your credentials and rename it to `config.env.json` where env is the environment to deploy. (dev, stg, prd)

Then you will be able to deploy as simple as `npm run deploy-env`

#To develop offline Run
`npm start`

#debug 
Download DynamoDB shell: http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_2015-07-16_1.0.tar.gz 
Extract it
`java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar`


#After all..
Then you can point to another repo to create new serverless APIs
`rm -rf .git`
`git init`
`git remote add origin [YOUR REPO]`
`git push -u origin master`


#For tests
`npm i -g mocha`

`mocha handler.test.js --compilers js:babel-core/register`



if something goes wrong  mid process. finish any process listening port 300 with:
`fuser -k -n tcp 3000`

## CONTENTS ##
1. serverless architecture
2. dynamodb tables setup offline
3. babel compilation from ES6
4. swagger documentation boilerplate
5. configuration files to simplify deploy to aws
6. package.json scripts to run and deploy
7. mocha test schema to start with TDD.
8. schema to start an API from scratch

