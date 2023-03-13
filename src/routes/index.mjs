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

// list route
Router.use("/files", routeFiles);
Router.use("/auth", routeAuth);
Router.use("/user", routeUser);
Router.use("/service", routeService);
Router.use("/article", routeArticle);
Router.use("/order", routeOrder);
Router.use("/wallet", routeWallet);

export default Router;
