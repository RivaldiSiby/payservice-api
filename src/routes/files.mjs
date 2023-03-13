import express from "express";
const Router = express.Router();
import path from "path";
// file route
Router.get("/service/img/:file", (req, res) => {
  const __dirname = path.resolve();
  console.log(req.params.file);
  res.sendFile(path.join(__dirname, `/data/services/img/${req.params.file}`));
});
Router.get("/article/img/:file", (req, res) => {
  const __dirname = path.resolve();
  console.log(req.params.file);
  res.sendFile(path.join(__dirname, `/data/articles/img/${req.params.file}`));
});

export default Router;
