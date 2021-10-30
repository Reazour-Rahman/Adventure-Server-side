const express = require("express");
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

/* :::::::::::::::::::::::::::
        MiddleWare
:::::::::::::::::::::::::::::: */
app.use(cors())
app.use(express.json())


/* uri */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cexwu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

/* :::::::::::::::::::::::::::
            Work
:::::::::::::::::::::::::::::: */

async function run() {
    try {
      await client.connect();
      console.log("database connected successfully");
      const database = client.db('adventure');

    /* places collection */
      const placesCollection = database.collection('places');

    /* orders collection */
      const ordersCollection = database.collection('orders');
        




    // get places api //
    app.get('/places', async (req, res) => {
        const cursor = placesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    })
    //post new places api //
    app.post('/places', async(req, res) =>{
        const place = req.body;

        const result = await placesCollection.insertOne(place);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.json(result)
    });







    //post order data api //
    app.post('/orders', async(req, res) =>{
        const order = req.body;

        const result = await ordersCollection.insertOne(order);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.json(result)
    });

     // get orders api //
     app.get('/orders', async (req, res) => {
        const cursor = ordersCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
    })







    /* ::::::::::::::::::::::::::::::::::::::::::::
                delete data from server
    ::::::::::::::::::::::::::::::::::::::::::::::*/
    app.delete('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await ordersCollection.deleteOne(query);
        res.json(result);
        console.log(result);
    });




    } finally {
    //   await client.close();
    }
  }

  run().catch(console.dir);







/* :::::::::::::::::::::::::::
        Minimum Setup
:::::::::::::::::::::::::::::: */
app.get('/', (req, res) =>{
    res.send("Server is running fast");
});

app.listen(port, ()=>{
    console.log("server is driving on", port);
});