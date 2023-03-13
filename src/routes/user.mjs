import express from "express";
import { userProfile } from "../controllers/user.mjs";
import { authCheck } from "../middlewares/auth/auth.mjs";
const Router = express.Router();

Router.get("/profile", authCheck, userProfile);

export default Router;
