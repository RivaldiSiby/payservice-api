import express from "express";
import {
  createOrder,
  readAllOrder,
  readUserOrder,
} from "../controllers/order.mjs";
import { adminCheck, authCheck } from "../middlewares/auth/auth.mjs";
const Router = express.Router();

Router.post("/", authCheck, createOrder);
Router.get("/", authCheck, adminCheck, readAllOrder);
Router.get("/user", authCheck, readUserOrder);

export default Router;
