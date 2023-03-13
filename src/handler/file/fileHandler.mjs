import fs from "fs";
import path from "path";

export const saveBase64 = (img, name, pathfile) => {
  const __dirname = path.resolve();
  let typeImg = img.split("/")[1];
  typeImg = typeImg.split(";")[0];
  const fileName = `${Date.now()}_${name}.${typeImg}`;
  let filePath = `${pathfile}${fileName}`;
  let buffer = Buffer.from(img.split(",")[1], "base64");
  fs.writeFileSync(path.join(__dirname, filePath), buffer);
  return fileName;
};

export const deleteFileImg = async (urlimg) => {
  const __dirname = path.resolve();
  await fs.promises.unlink(path.join(__dirname, `${urlimg}`));
};
