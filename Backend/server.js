const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err))

app.use("/api/products", productRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})