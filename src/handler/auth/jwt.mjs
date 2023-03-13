import jwt from "jsonwebtoken";

export const createJwt = (payload, tipe) => {
  let result;
  if (tipe === "access") {
    result = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "1h",
    });
  } else {
    result = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "2d",
    });
  }
  return result;
};

export const verivyJwt = (payload, tipe) => {
  let result;
  if (tipe === "access") {
    // result = jwt.verify(payload, process.env.ACCESS_TOKEN_KEY, {
    //   issuer: process.env.JWT_ISSUER,
    // });
    jwt.verify(
      payload,
      process.env.ACCESS_TOKEN_KEY,
      {
        issuer: process.env.JWT_ISSUER,
      },
      function (err, decoded) {
        if (err) {
          result = {
            err: true,
            data: err.message,
          };
        } else {
          result = { err: false, data: decoded };
        }
      }
    );
  } else {
    // result = jwt.verify(payload, process.env.REFRESH_TOKEN_KEY, {
    //   issuer: process.env.JWT_ISSUER,
    // });
    jwt.verify(
      payload,
      process.env.REFRESH_TOKEN_KEY,
      {
        issuer: process.env.JWT_ISSUER,
      },
      function (err, decoded) {
        if (err) {
          result = {
            err: true,
            data: err.message,
          };
        } else {
          result = { err: false, data: decoded };
        }
      }
    );
  }
  return result;
};
