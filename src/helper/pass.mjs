import bcrypt from "bcryptjs";

export const passHash = async (pass) => {
  const hashHandler = new Promise((resolve, reject) => {
    bcrypt.hash(pass, 8, function (err, hash) {
      resolve(hash);
    });
  });
  const result = await hashHandler;
  return result;
};

export const passCheck = async (pass, hash) => {
  const res = await bcrypt.compare(pass, hash);
  return res;
};
