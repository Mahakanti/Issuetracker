const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://mrinalkanti:12*12@mrinalcluster.qnlcszf.mongodb.net/skilltest?retryWrites=true&w=majority'
//const mongoose = require("mongoose")
async function getData() {
   let client= await MongoClient.connect(url);
    let connection = client.db('skilltest'); // Establish connection with database
    return connection.collection('issuetracker'); // create a collection with name 
   
}

module.exports = getData; 

