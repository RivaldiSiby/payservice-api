import { Op } from "sequelize";
import { uid } from "uid";
import { modelDb } from "../configs/db/db.mjs";
import {
  errRes,
  successRes,
  successResHaveData,
} from "../handler/response/res.mjs";
import { dateFormat } from "../helper/dateFormat.js";

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
    // get antrian hari ini
    const START = new Date();
    START.setHours(0, 0, 0, 0);
    const NOW = new Date();

    const todaysRecord = await modelDb.Queue.findAll({
      where: {
        createdAt: {
          [Op.between]: [START.toISOString(), NOW.toISOString()],
        },
      },
    });
    console.log(todaysRecord.length);
    let no = todaysRecord.length + 1;
    if (todaysRecord.length < 10) {
      no = `00${no}`;
    }
    if (todaysRecord.length < 100 && todaysRecord.length > 10) {
      no = `0${no}`;
    }
    if (todaysRecord.length >= 100) {
      no = `${no}`;
    }
    const no_antrian = `GAD-${dateFormat()}/LA-${no}`;
    console.log(no_antrian);
    const payloadAntrian = {
      e_no_queue: no_antrian,
      e_status: "waiting",
    };
    const dataQueue = await modelDb.Queue.create(payloadAntrian);
    const payload = {
      i_id: uid(16),
      i_service: i_service,
      i_user: req.user.id,
      i_price: price,
      i_no_queue: dataQueue.i_id,
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

export const readAllOrder = async (req, res) => {
  try {
    const result = await modelDb.Order.findAll({
      include: [
        {
          model: modelDb.Service,
          attributes: ["e_name"],
          as: "service",
          required: true,
        },
        {
          model: modelDb.User,
          attributes: ["e_name"],
          as: "user",
          required: true,
        },
        {
          model: modelDb.Queue,
          attributes: ["e_no_queue", "e_status"],
          as: "queue",
          required: true,
        },
      ],
    });
    return successResHaveData(
      res,
      200,
      "Read All Order has been Success",
      result
    );
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};

export const readUserOrder = async (req, res) => {
  try {
    const result = await modelDb.Order.findAll({
      where: {
        i_user: req.user.id,
      },
      include: [
        {
          model: modelDb.Service,
          attributes: ["e_name"],
          as: "service",
          required: true,
        },
        {
          model: modelDb.User,
          attributes: ["e_name"],
          as: "user",
          required: true,
        },
        {
          model: modelDb.Queue,
          attributes: ["e_no_queue", "e_status"],
          as: "queue",
          required: true,
        },
      ],
    });
    return successResHaveData(
      res,
      200,
      "Read User Order has been Success",
      result
    );
  } catch (error) {
    console.log(error);
    errRes(res, 500, "Have problem on Server");
  }
};
