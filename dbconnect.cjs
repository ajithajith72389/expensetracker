const {MongoClient} = require("mongodb")

let dbconnection
function connectToDb(CallBack) {
    MongoClient.connect('mongodb+srv://ajith:12345@cluster0.9ddzcb5.mongodb.net/expenseTracker?retryWrites=true&w=majority').then((client)=>{
        dbconnection = client.db()
        CallBack()


    }).catch((error)=>{
        CallBack(error)

    })
    
}

function getDb(){
    return dbconnection
}

module.exports = {connectToDb, getDb}