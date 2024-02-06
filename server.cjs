const express = require("express")
const bodyParser = require('body-parser')
const {ObjectId} = require("mongodb")
const {connectToDb, getDb} = require("./dbconnect.cjs")

const app =express()
app.use(bodyParser.json())

let db

connectToDb(function (error) {
    if (error) {
        console.log('Could not establish connection...')
        console.log(error)
    } else {
        app.listen(1817)
        db = getDb()
        console.log('Listening on port 1817...')
    }
})

// app.get('/', (request, response)=>{
//     response.send('Hello')
// })


app.post('/add-entry', function (request, response) {
    db.collection('ExpensesData').insertOne(request.body).then(function () {
        response.status(201).json({
            "status": "Entry added successfully"
        })
    }).catch(function () {
        response.status(500).json({
            "status": "Entry not added"
        })
    })
})

app.get('/get-entries', function (request, response) {
    // Declaring an empty array
    const entries = []
    db.collection('ExpensesData')
        .find()
        .forEach(entry => entries.push(entry))
        .then(function () {
            response.status(200).json(entries)
        }).catch(function () {
            response.status(500).json({
                "status": "Could not fetch documents"
            })
        })
})

app.delete('/delete-entry', function(request, response) {
    if(ObjectId.isValid(request.query.id)) {
        db.collection('ExpensesData').deleteOne({
            _id: new ObjectId(request.query.id)
        }).then(function() {
            response.status(200).json({
                "status" : "Entry successfully deleted"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Entry not deleted"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})

app.patch('/update-entry/:id', (request, response)=>{
    if(ObjectId.isValid(request.params.id)){
        db.collection("ExpensesData").updateOne(
            { _id: new ObjectId(request.params.id) }, { $set: request.body }
        ).then(() => {
            response.status(200).json({
                "status": "Successfully data updated"
            })
        }).catch(() => {
            response.status(500).json({
                'status': 'Not updated'
            })
        })
    } else {
        response.status(500).json({
            "status": "ObjectId not valid"
        })
    }
    
})