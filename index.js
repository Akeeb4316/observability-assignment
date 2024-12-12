const tracer = require("./tracing")("todo-service");
const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
app.use(express.json());
const port = 3000;
let db;
const startServer = async () => {
   try {
      console.log("Connecting to MongoDB...");
      const client = await MongoClient.connect("mongodb://localhost:27017/");
      console.log("MongoDB connected.");
      db = client.db("todo");
      console.log("Inserting sample data...");
      await db.collection("todos").insertMany([
         { id: "1", title: "Buy groceries" },
         { id: "2", title: "Install Aspecto" },
         { id: "3", title: "buy my own name domain" },
      ]);
      console.log("Starting Express server...");
      app.listen(port, () => {
         console.log(`Example app listening on port ${port}`);
      });
   } catch (err) {
      console.error("Failed to start server:", err);
   }
};
startServer();
app.get("/todo", async (req, res) => {
   const todos = await db.collection("todos").find({}).toArray();
   res.send(todos);
});
app.get("/todo/:id", async (req, res) => {
   const todo = await db.collection("todos").findOne({ id: req.params.id });
   res.send(todo);
});
