var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/'

MongoClient.connect(url, (err,db) => {
    if(err){throw err;}
    console.log("Database created.");
    var dbase = db.db("test-db");
    // dbase.createCollection('users',(err,res) => {
    //     if(err){throw err;}
    //     console.log("Set named "+'users'+" created.");
    //     db.close();
    // });
    // var testUser = [
    //     { userName: 'Zhangyu1',userPassword: '1234561' },
    //     { userName: 'Zhangyu2',userPassword: '1234562' },
    //     { userName: 'Zhangyu3',userPassword: '1234563' }
    // ];
    // dbase.collection('users').insertMany(testUser , (err,res) => {
    //     if(err){throw err;}
    //     console.log("Document inserted.");
    //     db.close();
    // });
    dbase.collection('users').find({'userName': 'Zhangyu1'}).toArray((err,res) => {
        if(err){throw err;}
        console.log(res);
        dbase.collection('users').deleteMany({'userName': 'Zhangyu1'},(err,res) => {
            if(err){throw err;}
            console.log("User "+'Zhangyu1'+' has been deleted.');
            dbase.collection('users').find({'userName': 'Zhangyu1'}).toArray((err,res) => {
                if(err){throw err;}
                console.log(res);
                db.close();
            });
        });
    });
    
});