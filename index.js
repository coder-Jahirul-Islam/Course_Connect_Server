// server.js
const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
            // console.log(newClass);
            newClass.availableSeats = parseInt(newClass.availableSeats);// optional
            const result = await classesCollection.insertOne(newClass);
            res.send(result);
        })

        // get approved class
        app.get('/classes', async (req, res) => {
            const query = { status: "approved" };
            const result = await classesCollection.find().toArray();
            res.send(result);
        })

        // get classes by instructor email address
        app.get('/classes/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { instructorEmail: email };
            const result = await classesCollection.find(query).toArray();
            res.send(result);
        })

        // manages classes
        app.get('/classes-manage', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
        })

        // update, update status and reason field using patch method 
    
        app.patch('/change-status/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const reason = req.body.reason;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: status,
                    reason: reason
                },
            };
            const result = await classesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // get approved classes
        app.get('/approved-classes', async (req, res) => {
            const query = { status: "approved" };
            const result = await classesCollection.find(query).toArray();
            res.send(result);
        })

        //get single class details 
        app.get('/class/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await classesCollection.findOne(query);
            res.send(result);
        })


      
        //update class details all data using put method
        app.put('/update-class/:id', async (req, res) => {
            const id = req.params.id;
            const updateClass = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateClass.name,
                    description: updateClass.description,
                    price: updateClass.price,
                    availableSeats: parseInt(updateClass.availableSeats),
                    videoLink: updateClass.videoLink,
                    status: "pending",
                }
            }
            const result = await classesCollection.updateOne(filter, updateDoc, options);
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