import express from "express";
import {
  createArticle,
  deleteArticle,
  editArticle,
  readAllArticle,
  readDetailArticle,
} from "../controllers/article.mjs";

import { adminCheck, authCheck } from "../middlewares/auth/auth.mjs";
const Router = express.Router();

Router.get("/", readAllArticle);
Router.get("/:id", readDetailArticle);
Router.post("/", authCheck, adminCheck, createArticle);
Router.delete("/:id", authCheck, adminCheck, deleteArticle);
Router.patch("/:id", authCheck, adminCheck, editArticle);

export default Router;
