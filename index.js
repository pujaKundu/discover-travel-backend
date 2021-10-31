const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzwpo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Discover travel databse is running");

    //create database and collection
    const database = client.db("discoverTravelDb");
    const servicesCollection = database.collection("services");
    const ordersCollection = database.collection("orders");

    //Get services api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //get single service api
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Hitting id", id);
      const query = { _id: ObjectId(id) };
      const results = await servicesCollection.findOne(query);
      res.send(results);
    });

    //post services
    app.post("/destinations", async (req, res) => {
      const destination = req.body;
      console.log("destination hitted", destination);
      const result = await servicesCollection.insertOne(destination);
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      console.log(order);
      console.log("post hitted");
      const result = await ordersCollection.insertOne(order);
      res.json(result);
      // res.send("post hitted");
      //console.log(result);
    });
    //update

    //get posted orders
    app.get("/userOrders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });
    //get single order
    app.get("/userOrders/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Hitting id", id);
      const query = { _id: ObjectId(id) };
      const results = await ordersCollection.findOne(query);
      res.send(results);
    });
    //delete api
    app.delete("/userOrders/:id", async (req, res) => {
      const id = req.params.id;
      console.log("deleted", id);
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
    //UPDATE API
    app.put("/userOrders/:id", async (req, res) => {
      const id = req.params.id;
      const updatedOrder = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          state: updatedOrder.state,
        },
      };
      const result = await ordersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log("updating", id);
      res.json(result);
    });
    //get orders by email api
    // app.get("/userOrders/:userEmail", async (req, res) => {
    //   const email = req.params;
    //   console.log("Hitting email", email);
    // });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Discover travel server started");
});

app.listen(port, () => {
  console.log("Discover travel server started on port", port);
});
