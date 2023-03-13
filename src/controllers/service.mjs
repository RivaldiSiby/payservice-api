import { uid } from "uid";
import { modelDb } from "../configs/db/db.mjs";
import { deleteFileImg, saveBase64 } from "../handler/file/fileHandler.mjs";
import {
  errRes,
  successRes,
  successResHaveData,
} from "../handler/response/res.mjs";
import { validationAllNull, validationNull } from "../helper/validation.mjs";

export const createService = async (req, res) => {
  try {
    const { name, price, img } = req.body;
    // validation
    const arr = [name, price, img];
    let check = validationNull(arr);
    if (check) {
      return errRes(res, 400, check);
    }
    const path = saveBase64(img, "service", "/data/services/img/");
    const paylaod = {
      i_id: uid(16),
      e_name: name,
      e_price: price,
      e_img_path: path,
    };
    const result = await modelDb.Service.create(paylaod);
    successResHaveData(res, 201, "Service has been created", {
      id: result.i_id,
    });
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};
export const editService = async (req, res) => {
  try {
    const { name, price, img } = req.body;
    const id = req.params.id;
    // validation
    const arr = [name, price, img];
    let check = validationAllNull(arr);
    if (check) {
      return errRes(res, 400, check);
    }
    const checkdata = await modelDb.Service.findOne({ where: { i_id: id } });
    console.log(checkdata);
    if (checkdata === null) {
      return errRes(res, 404, "Service not found");
    }

    let paylaod = {
      e_name: checkdata.e_name,
      e_price: checkdata.e_price,
      e_img_path: checkdata.e_img_path,
    };
    if (img !== "") {
      const path = saveBase64(img, "service");
      await deleteFileImg(`/data/services/img/${checkdata.e_img_path}`);
      paylaod.e_img_path = path;
    }
    if (name !== "") {
      paylaod.e_name = name;
    }
    if (price !== "") {
      paylaod.e_price = price;
    }
    await modelDb.Service.update(paylaod, { where: { i_id: id } });
    successRes(res, 200, "Service has been updated");
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};

export const deleteService = async (req, res) => {
  try {
    const id = req.params.id;
    const checkdata = await modelDb.Service.findOne({ where: { i_id: id } });
    if (checkdata === null) {
      return errRes(res, 404, "Service not found");
    }
    await deleteFileImg(`/data/services/img/${checkdata.e_img_path}`);
    await modelDb.Service.destroy({ where: { i_id: id } });
    successRes(res, 200, "Service has been deleted");
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};

export const readAllService = async (req, res) => {
  try {
    const data = await modelDb.Service.findAll();
    let wrapData = [];
    data.map((v) => {
      let item = v;
      item.e_img_path = `${process.env.URL_DEV}/files/service/img/${v.e_img_path}`;
      wrapData.push(item);
    });
    successResHaveData(
      res,
      200,
      "Get all data services has been success",
      wrapData
    );
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};

export const readDetailService = async (req, res) => {
  try {
    const data = await modelDb.Service.findOne({
      where: { i_id: req.params.id },
    });
    if (data === null) {
      errRes(res, 404, "Service not found");
    }
    let wrapData = data;
    wrapData.e_img_path = `${process.env.URL_DEV}/files/service/img/${data.e_img_path}`;
    successResHaveData(
      res,
      200,
      "Get Detail service has been success",
      wrapData
    );
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};
