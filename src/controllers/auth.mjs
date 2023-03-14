import { modelDb } from "../configs/db/db.mjs";
import {
  errRes,
  successRes,
  successResHaveData,
} from "../handler/response/res.mjs";
import { validationNull } from "../helper/validation.mjs";
import { uid } from "uid";
import { passCheck, passHash } from "../helper/pass.mjs";
import { createJwt } from "../handler/auth/jwt.mjs";

export const registUser = async (req, res) => {
  try {
    const { name, password, confirmPass } = req.body;
    const arr = [name, password, confirmPass];
    //   validatio
    let check = validationNull(arr);
    if (check) {
      return errRes(res, 400, check);
    }
    if (password !== confirmPass) {
      return errRes(res, 400, "Confirm Password does not match");
    }
    const pass = await passHash(password);
    const walletUser = {
      i_id: uid(16),
      i_balance: "0",
    };
    const walletData = await modelDb.Wallet.create(walletUser);
    const payload = {
      i_id: uid(16),
      e_name: name,
      e_password: pass,
      i_wallet: walletData.i_id,
      i_role: "2",
    };
    const user = await modelDb.User.create(payload);

    successRes(res, 201, "Register Has been success");
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const check = await modelDb.User.findOne({ where: { e_name: name } });
    if (check == null) {
      return errRes(res, 401, "Email or Password is wrong");
    }
    console.log(check);
    const checkpass = await passCheck(password, check.e_password);
    console.log(checkpass);
    if (!checkpass) {
      return errRes(res, 401, "Email or Password is wrong");
    }
    const payload = {
      id: check.i_id,
      name: check.e_name,
      role: check.i_role,
      id_wallet: check.i_wallet,
    };
    // toker handler
    const accessToken = createJwt(payload, "access");
    const refreshToken = createJwt(payload, "refresh");
    // send auth data
    const payloadAuth = {
      i_id: uid(16),
      i_user: check.i_id,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    const result = await modelDb.User.findOne({
      where: { i_id: check.i_id },
      include: [
        {
          model: modelDb.Wallet,
          attributes: ["i_balance"],
          as: "wallet",
          required: true,
        },
        {
          model: modelDb.Role,
          attributes: ["e_name"],
          as: "role",
          required: true,
        },
      ],
    });

    const userdData = {
      id: result.i_id,
      name: result.e_name,
      i_wallet: result.i_wallet,
      role: result.role.e_name,
      wallet: result.wallet.i_balance,
    };
    await modelDb.Auth.create(payloadAuth);
    return successResHaveData(res, 200, "Login has been Success", {
      access_token: accessToken,
      user: userdData,
    });
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};
export const loginAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;
    const check = await modelDb.User.findOne({ where: { e_name: name } });
    if (check == null) {
      return errRes(res, 400, "Email or Password is wrong");
    }
    console.log(check);

    console.log(check.i_role);
    if (check.i_role === 2) {
      return errRes(res, 400, "Email or Password is wrong");
    }
    const checkpass = await passCheck(password, check.e_password);
    console.log(checkpass);
    if (!checkpass) {
      return errRes(res, 400, "Email or Password is wrong");
    }
    const payload = {
      id: check.i_id,
      name: check.e_name,
      role: check.i_role,
      id_wallet: check.i_wallet,
    };
    // toker handler
    const accessToken = createJwt(payload, "access");
    const refreshToken = createJwt(payload, "refresh");
    // send auth data
    const payloadAuth = {
      i_id: uid(16),
      i_user: check.i_id,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    await modelDb.Auth.create(payloadAuth);
    return successResHaveData(res, 200, "Login has been Success", {
      access_token: accessToken,
    });
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};

export const logoutUser = async (req, res) => {
  try {
    const user = req.user;
    await modelDb.Auth.destroy({ where: { i_user: user.id } });
    successRes(res, 200, "Logout has been Success");
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};
