import { uid } from "uid";
import { modelDb } from "../configs/db/db.mjs";
import { deleteFileImg, saveBase64 } from "../handler/file/fileHandler.mjs";
import {
  errRes,
  successRes,
  successResHaveData,
} from "../handler/response/res.mjs";
import { validationAllNull, validationNull } from "../helper/validation.mjs";

const Article = modelDb.Article;
export const createArticle = async (req, res) => {
  try {
    const { title, text, img } = req.body;
    // validation
    const arr = [title, text];
    let check = validationNull(arr);
    if (check) {
      return errRes(res, 400, check);
    }
    let path = null;
    if (img !== "") {
      path = saveBase64(img, "article", "/data/articles/img/");
    }
    const paylaod = {
      i_id: uid(16),
      e_title: title,
      e_text: text,
      e_img_path: path,
    };
    const result = await Article.create(paylaod);
    successResHaveData(res, 201, "Article has been created", {
      id: result.i_id,
    });
  } catch (error) {
    console.log(error);
    return errRes(res, 500, "Have problem on Server");
  }
};
export const editArticle = async (req, res) => {
  try {
    const { title, text, img } = req.body;
    const id = req.params.id;
    // validation
    const arr = [title, text];
    let check = validationAllNull(arr);
    if (check) {
      return errRes(res, 400, check);
    }
    const checkdata = await Article.findOne({ where: { i_id: id } });
    console.log(checkdata);
    if (checkdata === null) {
      return errRes(res, 404, "Article not found");
    }

    let paylaod = {
      e_title: checkdata.e_title,
      e_text: checkdata.e_text,
      e_img_path: checkdata.e_img_path,
    };
    if (img !== "") {
      const path = saveBase64(img, "article", "/data/articles/img/");
      await deleteFileImg(`/data/articles/img/${checkdata.e_img_path}`);
      paylaod.e_img_path = path;
    }
    if (title !== "") {
      paylaod.e_title = title;
    }
    if (text !== "") {
      paylaod.e_text = text;
    }
    await Article.update(paylaod, { where: { i_id: id } });
    return successRes(res, 200, "Article has been updated");
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const id = req.params.id;
    const checkdata = await Article.findOne({ where: { i_id: id } });
    if (checkdata === null) {
      return errRes(res, 404, "Article not found");
    }
    await deleteFileImg(`/data/articles/img/${checkdata.e_img_path}`);
    await Article.destroy({ where: { i_id: id } });
    successRes(res, 200, "Article has been deleted");
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};

export const readAllArticle = async (req, res) => {
  try {
    const data = await Article.findAll();
    let wrapData = [];
    data.map((v) => {
      let item = v;
      item.e_img_path = `${process.env.URL_DEV}/files/article/img/${v.e_img_path}`;
      wrapData.push(item);
    });
    successResHaveData(
      res,
      200,
      "Get all data Articles has been success",
      wrapData
    );
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};

export const readDetailArticle = async (req, res) => {
  try {
    const data = await Article.findOne({ where: { i_id: req.params.id } });
    if (data === null) {
      return errRes(res, 404, "Article not found");
    }
    let wrapData = data;
    wrapData.e_img_path = `${process.env.URL_DEV}/files/article/img/${data.e_img_path}`;
    successResHaveData(
      res,
      200,
      "Get Detail Article has been success",
      wrapData
    );
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};
