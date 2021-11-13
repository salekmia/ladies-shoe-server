const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;
 
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zd73h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("ladies_shoe");
      const usersCollection = database.collection("users");
      const productsCollection = database.collection("products") 
      const reviewsCollection = database.collection("reviews");
      const ordersCollection = database.collection("orders")
     
        // post method for users
        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result)
            console.log(result)
        })

        // post method for products
        app.post('/products', async(req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result)
            console.log(result)
        })

        // porst method for reviews
        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.json(result)
            console.log(result)
        })

        // post method for orders
        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result)
            console.log(result)
        })

        // get method for products
        app.get('/products', async(req, res) => {
            const products = productsCollection.find({})
            const result = await products.toArray()
            res.json(result)
        })

        // get method for orders
        app.get('/orders', async(req, res) => {
            const orders = ordersCollection.find({})
            const result = await orders.toArray()
            res.json(result)
        })

        // get method for reviews
        app.get('/reviews', async(req, res) => {
            const reviews = reviewsCollection.find({})
            const result = await reviews.toArray()
            res.json(result)
        })

        // delete method for order delete
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

        // delete method for product delete
        app.delete('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await productsCollection.deleteOne(query)
            res.json(result)
        })


        // get special product by id
        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            console.log('getting specific product', id);
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query)
            res.json(product)
        })

        // put method for users
        app.put('/users', async(req, res) => {
            const user = req.body;
            const filter = {email: user.email}
            const options = {upsert: true}
            const updateDoc = {$set: user}
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })


        app.put('/users/admin', async(req, res) => {
            const user = req.body;
            console.log(user)
            const filter = {email: user.email}
            const updateDoc = {$set: {role: 'admin'}}
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
            console.log(result)
        })

        app.get('/users/:email', async(req, res) => {
            const email = req.params.email;
            const query = {email: email}
            const user = await usersCollection.findOne(query)
            let isAdmin = false
            if(user?.role === 'admin') {
                isAdmin = true
            }
            res.json({admin: isAdmin})
        })


        // put method for updating status of order
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrders = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedOrders.status
                },
            };
            const booking = await ordersCollection.updateOne(filter, updateDoc, options);
            console.log('updated api booking pending', id)
            res.json(booking);

        })
        

     
    } finally {
    //   await client.close();
    }
  }
 run().catch(console.dir);


app.get('/', (req, res) => {
   res.send('hello ladies shoe')
})
 
app.listen(port, () => {
   console.log('Ladies shoe Server on port', port);
})


// hello again