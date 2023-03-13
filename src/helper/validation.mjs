export const validationNull = (arr) => {
  let nullField = 0;
  arr.map((v) => {
    if (v === "") {
      nullField += 1;
    }
  });
  if (nullField === 0) {
    return false;
  } else {
    return "there is input that has not been filled";
  }
};
export const validationAllNull = (arr) => {
  let nullField = 0;
  arr.map((v) => {
    if (v === "") {
      nullField += 1;
    }
  });
  if (nullField === 0) {
    return false;
  } else if (nullField === arr.length) {
    return "there must be input filled";
  }
};
