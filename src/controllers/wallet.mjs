import { uid } from "uid";
import { modelDb } from "../configs/db/db.mjs";
import {
  errRes,
  successRes,
  successResHaveData,
} from "../handler/response/res.mjs";

export const topUpWallet = async (req, res) => {
  try {
    console.log(req.user);
    const i_wallet = req.user.id_wallet;
    const { balance } = req.body;
    const walletData = await modelDb.Wallet.findOne({
      where: { i_id: i_wallet },
    });
    if (walletData === null) {
      return errRes(res, 404, "Wallet data not found");
    }

    const newBalance = parseInt(walletData.i_balance) + parseInt(balance);
    await modelDb.Wallet.update(
      { i_balance: newBalance },
      { where: { i_id: i_wallet } }
    );
    const transactionPaylpad = {
      i_id: uid(16),
      i_user: req.user.id,
      e_transaction_type: "topup",
      i_price: balance,
    };
    await modelDb.Transaction.create(transactionPaylpad);
    return successResHaveData(res, 201, "Topup has been success", {
      topup: true,
      wallet: `${newBalance}`,
    });
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};

export const withDrawWallet = async (req, res) => {
  try {
    const i_wallet = req.user.id_wallet;
    const { balance } = req.body;
    const walletData = await modelDb.Wallet.findOne({
      where: { i_id: i_wallet },
    });
    if (walletData === null) {
      return errRes(res, 404, "Wallet data not found");
    }

    const newBalance = parseInt(walletData.i_balance) - parseInt(balance);
    if (newBalance <= 0) {
      return successResHaveData(
        res,
        200,
        "Saldo tidak cukup untuk melakukan penarikan",
        { withdraw: false, wallet: walletData.i_balance }
      );
    }
    await modelDb.Wallet.update(
      { i_balance: newBalance },
      { where: { i_id: i_wallet } }
    );
    const transactionPaylpad = {
      i_id: uid(16),
      i_user: req.user.id,
      e_transaction_type: "withdraw",
      i_price: balance,
    };
    await modelDb.Transaction.create(transactionPaylpad);
    return successResHaveData(res, 201, "Withdraw has been succes", {
      withdraw: true,
      total: `${newBalance}`,
    });
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};

export const historyWallet = async (req, res) => {
  try {
    const id = req.user.id;
    const result = await modelDb.Transaction.findAll({ where: { i_user: id } });
    const data = result;
    return successResHaveData(
      res,
      200,
      "Read History Transactions Wallet has been success",
      data
    );
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};
