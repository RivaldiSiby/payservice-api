import express from "express";
import { loginUser, logoutUser, registUser } from "../controllers/auth.mjs";
import { authCheck } from "../middlewares/auth/auth.mjs";
const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(200).send("system Auth");
});

Router.post("/regist", registUser);
Router.post("/login", loginUser);
Router.get("/logout", authCheck, logoutUser);
Router.get("/test", authCheck, (req, res) => {
  res.status(200).send("Testing api user " + req.user.name);
});

export default Router;
