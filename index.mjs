import express from "express";
const app = express();
import * as dotenv from "dotenv";
import Router from "./src/routes/index.mjs";
import connectDb from "./src/configs/db/db.mjs";
import cors from "cors";
dotenv.config();
const port = process.env.PORT;

const init = async () => {
  try {
    // check db
    await connectDb();
    app.get("/", (req, res) => {
      res.send("hello world");
    });
    const corsOptions = {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };
    // cors connect
    app.use(cors(corsOptions));

    // parse requests of content-type - application/json
    app.use(express.json({ limit: "10mb" }));

    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // use router
    app.use(Router);

    app.listen(port, () => {
      console.log(`Server Started at port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
init();
