import { modelDb } from "../../configs/db/db.mjs";
import { verivyJwt } from "../../handler/auth/jwt.mjs";
import { errRes } from "../../handler/response/res.mjs";

export const authCheck = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      errRes(res, 401, "Sign in Needed");
    }
    const accessToken = token.split(" ")[1];
    // verifiy
    const data = verivyJwt(accessToken, "access");
    console.log(data);
    if (data.err === true) {
      if (data.data !== "jwt expired") {
        return errRes(res, 401, "Sign in Needed");
      } else {
        console.log("expired handler");
        const tokenGet = await modelDb.Auth.findOne({
          where: { access_token: accessToken },
        });
        console.log(tokenGet);
        if (tokenGet === null) {
          return errRes(res, 401, "Sign in Needed");
        }
        const checkRefresh = verivyJwt(tokenGet.refresh_token, "refresh");

        if (checkRefresh.err === true) {
          return errRes(res, 401, "Sign in Needed");
        } else {
          // generate new access token
          req.user = {
            id: checkRefresh.data.id,
            name: checkRefresh.data.name,
            role: checkRefresh.data.role,
            id_wallet: checkRefresh.data.id_wallet,
          };
          next();
        }
      }
    } else {
      req.user = {
        id: data.data.id,
        name: data.data.name,
        role: data.data.role,
        id_wallet: data.data.id_wallet,
      };
      next();
    }
  } catch (error) {
    errRes(res, 500, "Have problem on Server");
  }
};

export const adminCheck = (req, res, next) => {
  try {
    const role = req.user.role;
    console.log(role);
    if (role !== 1) {
      errRes(res, 403, "Forbiden Access");
    } else {
      next();
    }
  } catch (error) {
    errRes(res, 500, "Have problem on Server");
  }
};
