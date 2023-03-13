import express from "express";
import {
  historyWallet,
  topUpWallet,
  withDrawWallet,
} from "../controllers/wallet.mjs";
import { authCheck } from "../middlewares/auth/auth.mjs";
const Router = express.Router();

// list route
Router.get("/history", authCheck, historyWallet);
Router.post("/topup", authCheck, topUpWallet);
Router.post("/withdraw", authCheck, withDrawWallet);

export default Router;
