import { uid } from "uid";
import { modelDb } from "../configs/db/db.mjs";
import {
  errRes,
  successRes,
  successResHaveData,
} from "../handler/response/res.mjs";

export const createOrder = async (req, res) => {
  try {
    const i_wallet = req.user.id_wallet;
    const { i_service, price } = req.body;

    const getWallet = await modelDb.Wallet.findOne({
      where: { i_id: i_wallet },
    });
    const cacl = parseInt(getWallet.i_balance) - parseInt(price);
    if (cacl <= 0) {
      return successResHaveData(
        res,
        200,
        "Saldo tidak cukup untuk melakukan transaksi",
        { buy: false }
      );
    }
    await modelDb.Wallet.update(
      { i_balance: cacl },
      { where: { i_id: i_wallet } }
    );
    const payload = {
      i_id: uid(16),
      i_service: i_service,
      i_user: req.user.id,
      i_price: price,
    };

    const idorder = await modelDb.Order.create(payload);
    // transaction
    const transactionPaylpad = {
      i_id: uid(16),
      i_user: req.user.id,
      e_transaction_type: "order",
      i_order: idorder.i_id,
      i_price: price,
    };
    await modelDb.Transaction.create(transactionPaylpad);
    successResHaveData(res, 201, "Order has been created", {
      id: idorder.i_id,
    });
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};
