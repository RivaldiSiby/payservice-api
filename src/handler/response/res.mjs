export const successRes = (res, status, msg) => {
  const payload = {
    status: "success",
    message: msg,
  };
  return res.status(status).send(payload);
};
export const successResHaveData = (res, status, msg, data) => {
  const payload = {
    status: "success",
    message: msg,
    data: data,
  };
  return res.status(status).send(payload);
};
export const errRes = (res, status, msg) => {
  const payload = {
    status: "error",
    message: msg,
  };
  return res.status(status).send(payload);
};
