const express = require("express");
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 4000;

// cors middleware to use different port
app.use(cors());
// json data pass from body middleware
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.weui7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// db functions
async function run() {
  try {
    await client.connect();
    const database = client.db("diagnosticCenter");
    const usersCollection = database.collection("users");
    const doctorsCollection = database.collection("doctors");
    const appointmentsCollection = database.collection("appointments");
    const testimonialCollection = database.collection("testimonial");
    //----------------------------------------------------

    // POST a doctor
    app.post("/doctors", async (req, res) => {
      const doctor = req.body;
      const result = await doctorsCollection.insertOne(doctor);
      res.json(result);
    });
    //find all doctors
    app.get("/doctors", async (req, res) => {
      const result = await doctorsCollection.find({}).toArray();
      res.json(result);
    });
    // find single doctor
    app.get("/doctors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await doctorsCollection.findOne(query);
      res.json(result);
    });
    // delete doctor
    app.delete("/doctors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await doctorsCollection.deleteOne(query);
      res.json(result);
    });
    // POST a Appointment
    app.post("/appointments", async (req, res) => {
      const appointment = req.body;
      const result = await appointmentsCollection.insertOne(appointment);
      res.json(result);
    });
    //find all Appointment
    app.get("/appointments", async (req, res) => {
      const result = await appointmentsCollection.find({}).toArray();
      res.json(result);
    });
    // find single Appointment
    app.get("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await appointmentsCollection.findOne(query);
      res.json(result);
    });
    // find Appointment by user email
    app.get("/appointments/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await appointmentsCollection.find(query).toArray();
      res.json(result);
    });
    // update Appointment status
    app.put("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status.status,
        },
      };
      const result = await appointmentsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // delete Appointment
    app.delete("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await appointmentsCollection.deleteOne(query);
      res.json(result);
    });
    // POST a Testimonial
    app.post("/testimonials", async (req, res) => {
      const appointment = req.body;
      const result = await testimonialCollection.insertOne(appointment);
      res.json(result);
    });
    //find all Testimonial
    app.get("/testimonials", async (req, res) => {
      const result = await testimonialCollection.find({}).toArray();
      res.json(result);
    });
    // find single Testimonial
    app.get("/testimonials/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await testimonialCollection.findOne(query);
      res.json(result);
    });
    // find Testimonial by user email
    app.get("/testimonials/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await testimonialCollection.find(query).toArray();
      res.json(result);
    });
    // update Testimonial status
    app.put("/testimonials/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status.status,
        },
      };
      const result = await appointmentsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // delete Testimonial
    app.delete("/testimonials/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await testimonialCollection.deleteOne(query);
      res.json(result);
    });
    // GET user if admin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    // POST Users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    // UPDATE or POST user from google sign in
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // UPDATE user role
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Doctors Portal!");
});

app.listen(port, () => {
  console.log(`Listening at : ${port}`);
});
