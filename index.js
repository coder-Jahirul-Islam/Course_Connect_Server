// server.js
const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@course-connect.3i4h75b.mongodb.net/?retryWrites=true&w=majority&appName=course-connect`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Connect to the "insertDB" database and access collections
        const database = client.db("courseConnect");
        const usersCollection = database.collection("users")
        const classesCollection = database.collection("classes");
        const cartsCollection = database.collection("carts");
        const paymentCollection = database.collection("payment");
        const enrolledCollection = database.collection("enrolled");
        const appliedCollection = database.collection("applied");

        // classes routes

        // post 
        app.post('/new-class', async (req, res) => {
            const newClass = req.body;
            console.log(newClass);
            newClass.availableSeats = parseInt(newClass.availableSeats);// optional
            const result = await classesCollection.insertOne(newClass);
            res.send(result);
        })
       



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello, CourseConnect!');
});

app.listen(port, () => {
    console.log(`Server is running on this port http://localhost:${port}`);
});