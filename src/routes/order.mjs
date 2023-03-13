import express from "express";
import { createOrder } from "../controllers/order.mjs";
import { authCheck } from "../middlewares/auth/auth.mjs";
const Router = express.Router();

Router.post("/", authCheck, createOrder);

export default Router;
