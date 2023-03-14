export const dateFormat = () => {
  let date = new Date();
  let fixdate = date.toISOString().split("T")[0];
  let fix = fixdate.split("-");
  let format = `${fix[2]}${fix[1]}${fix[0][2]}${fix[0][3]}`;
  return format;
};
