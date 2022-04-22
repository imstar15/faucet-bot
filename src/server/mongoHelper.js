var MongoClient = require('mongodb').MongoClient

class MongoHelper {
  constructor () {

  }
  
  connect = async () => {
    const client = await MongoClient.connect(
      'mongodb://charles:Rewq1234@docdb-2022-04-22-03-28-11.cluster-cp3zurulhfbo.us-east-1.docdb.amazonaws.com:27017/?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
      // 'mongodb://<sample-user>:<password>@sample-cluster.node.us-east-1.docdb.amazonaws.com:27017/sample-database?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
      //Specify the DocDB; cert
      { tlsCAFile: `rds-combined-ca-bundle.pem` },
      // function(err, client) {
      //     if( err ) {
      //       throw err;
      //     }
      //   //   //Specify the database to be used
      //   //   db = client.db('sample-database');
      
      //   //   //Specify the collection to be used
      //   //   col = db.collection('sample-collection');
      
      //   //   //Insert a single document
      //   //   col.insertOne({'hello':'Amazon DocumentDB'}, function(err, result){
      //   //     //Find the document that was previously written
      //   //     col.findOne({'hello':'DocDB;'}, function(err, result){
      //   //       //Print the result to the screen
      //   //       console.log(result);
      
      //   //       //Close the connection
      //   //       client.close()
      //   //     });
      //   //  });
      // }
    );
    return client;
  }
}

module.exports = MongoHelper;
