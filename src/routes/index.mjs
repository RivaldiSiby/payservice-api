import express from "express";
const Router = express.Router();

// router list
import routeFiles from "./files.mjs";
import routeAuth from "./auth.mjs";
import routeService from "./service.mjs";
import routeArticle from "./article.mjs";
import routeUser from "./user.mjs";
import routeOrder from "./order.mjs";
import routeWallet from "./wallet.mjs";
import { adminCheck, authCheck } from "../middlewares/auth/auth.mjs";
import { modelDb } from "../configs/db/db.mjs";
import { errRes, successResHaveData } from "../handler/response/res.mjs";

// list route
// get dahsboard route
Router.get("/all/data", authCheck, adminCheck, async (req, res) => {
  try {
    const user = await modelDb.User.count();
    const transaction = await modelDb.Transaction.count();
    const order = await modelDb.Order.count();
    const article = await modelDb.Article.count();
    const service = await modelDb.Service.count();
    successResHaveData(res, 200, "Read All data count has been success", {
      user: user,
      transaction: transaction,
      order: order,
      article: article,
      service: service,
    });
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
});
Router.use("/files", routeFiles);
Router.use("/auth", routeAuth);
Router.use("/user", routeUser);
Router.use("/service", routeService);
Router.use("/article", routeArticle);
Router.use("/order", routeOrder);
Router.use("/wallet", routeWallet);

export default Router;
