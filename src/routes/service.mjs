import express from "express";
import {
  createService,
  deleteService,
  editService,
  readAllService,
  readDetailService,
} from "../controllers/service.mjs";
import { adminCheck, authCheck } from "../middlewares/auth/auth.mjs";
const Router = express.Router();

Router.get("/", readAllService);
Router.get("/:id", readDetailService);
Router.post("/", authCheck, adminCheck, createService);
Router.delete("/:id", authCheck, adminCheck, deleteService);
Router.patch("/:id", authCheck, adminCheck, editService);
Router.delete("/:id", authCheck, adminCheck, deleteService);

export default Router;
