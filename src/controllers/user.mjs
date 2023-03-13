import { modelDb } from "../configs/db/db.mjs";
import { errRes, successResHaveData } from "../handler/response/res.mjs";

export const userProfile = async (req, res) => {
  try {
    const user = req.user;
    const result = await modelDb.User.findOne({
      where: { i_id: user.id },
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
    const payload = {
      id: result.i_id,
      name: result.e_name,
      i_wallet: result.i_wallet,
      role: result.role.e_name,
      wallet: result.wallet.i_balance,
    };
    return successResHaveData(
      res,
      200,
      "Read User Profile has been success",
      payload
    );
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};
