


// IMPORTS FROM PACKAGES
const express = require("express");
const mongoose = require("mongoose");
const adminRouter = require("./routes/admin");
// IMPORTS FROM OTHER FILES
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const itemRoutes = require("./routes/learn/route");
const cors = require('cors');

// INIT
const PORT = process.env.PORT || 3000;
const app = express();



app.use(cors());
const DB =
  "mongodb+srv://sabik:sabik@cluster0.y5doltf.mongodb.net/?retryWrites=true&w=majority";

// middleware
app.use(express.json());
app.use(itemRoutes);
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

// Connections
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
