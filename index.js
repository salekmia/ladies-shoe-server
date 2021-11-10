const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
 

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
     
    // post method for users
        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result)
            console.log(result)
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




// ladies_shoe
// p3o80kvbgCxva82f