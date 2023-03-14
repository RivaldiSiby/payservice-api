import { Sequelize, DataTypes } from "sequelize";

// db config
const db = new Sequelize("db_testapp", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  //   options for dev
  dialectOptions: {
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
  },
});

const model = {};

// modal table created
model.Wallet = db.define(
  "wallet",
  {
    i_id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    i_balance: {
      type: DataTypes.TEXT,
    },
  },
  { freezeTableName: true, timeStamp: true }
);
// user table
model.User = db.define(
  "user",
  {
    i_id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    e_name: {
      type: DataTypes.CHAR,
    },
    e_password: {
      type: DataTypes.TEXT,
    },
    i_wallet: {
      type: DataTypes.CHAR,
      references: {
        model: model.Wallet,
        key: "i_id",
      },
    },
    i_role: {
      type: DataTypes.INTEGER,
      references: {
        model: model.Role,
        key: "i_id",
      },
    },
  },
  { timeStamp: true }
);

// auth table
model.Auth = db.define(
  "auth",
  {
    i_id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    i_user: {
      type: DataTypes.CHAR,
    },
    access_token: {
      type: DataTypes.TEXT,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
  },
  { timeStamp: true }
);

// role table
model.Role = db.define(
  "role",
  {
    i_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    e_name: {
      type: DataTypes.CHAR,
    },
  },
  { timeStamp: false }
);

// service table
model.Service = db.define(
  "service",
  {
    i_id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    e_name: {
      type: DataTypes.CHAR,
    },
    e_price: {
      type: DataTypes.CHAR,
    },
    e_img_path: {
      type: DataTypes.TEXT,
    },
  },
  { timeStamp: true }
);

// article table
model.Article = db.define(
  "article",
  {
    i_id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    e_title: {
      type: DataTypes.CHAR,
    },
    e_text: {
      type: DataTypes.TEXT,
    },
    e_img_path: {
      type: DataTypes.TEXT,
    },
  },
  { timeStamp: true }
);
// queue table

model.Queue = db.define(
  "queue",
  {
    i_id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    e_no_queue: {
      type: DataTypes.CHAR,
    },
    e_status: {
      type: DataTypes.CHAR,
    },
  },
  { timeStamp: true, freezeTableName: true }
);

// order table
model.Order = db.define(
  "order",
  {
    i_id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    i_service: {
      type: DataTypes.CHAR,
      references: {
        model: model.Service,
        key: "i_id",
      },
    },
    i_user: {
      type: DataTypes.CHAR,
      references: {
        model: model.User,
        key: "i_id",
      },
    },
    i_no_queue: {
      type: DataTypes.CHAR,
      references: {
        model: model.Queue,
        key: "i_id",
      },
    },
    i_price: {
      type: DataTypes.INTEGER,
    },
  },
  { timeStamp: true }
);
// transaction
model.Transaction = db.define(
  "transaction",
  {
    i_id: {
      type: DataTypes.CHAR,
      primaryKey: true,
    },
    i_user: {
      type: DataTypes.CHAR,
      references: {
        model: model.User,
        key: "i_id",
      },
    },
    e_transaction_type: {
      type: DataTypes.CHAR,
    },
    i_order: {
      type: DataTypes.CHAR,
      allowNull: true,
    },
    i_price: {
      type: DataTypes.INTEGER,
    },
  },
  { timeStamp: true }
);

// associate table
model.User.belongsTo(model.Role, { foreignKey: "i_role" });
model.User.belongsTo(model.Wallet, { foreignKey: "i_wallet" });
model.Transaction.belongsTo(model.User, { foreignKey: "i_user" });
model.Order.belongsTo(model.User, { foreignKey: "i_user" });
model.Order.belongsTo(model.Service, { foreignKey: "i_service" });
model.Order.belongsTo(model.Queue, { foreignKey: "i_no_queue" });

export const modelDb = model;
const connectDb = async () => {
  try {
    await db.authenticate();
    console.log("Database is Connected");
    await db.sync({ alter: false });
    // make data
    // model.Role.create({ i_role: "1", e_name: "Admin" });
    // model.Role.create({ i_role: "2", e_name: "User" });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connectDb;
