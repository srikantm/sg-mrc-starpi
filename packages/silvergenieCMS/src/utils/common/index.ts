import * as path from "path";
import * as fs from "fs";
const crypto = require("crypto");

export const getBasePath = () => {
  return path.join(__dirname).split("/dist/src")[0];
};

export const writeFile = (filePath: string, contents: string) => {
  const finalPath = path.join(getBasePath(), filePath);
  const dir = path.dirname(finalPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFile(finalPath, contents, function (err) {
    if (err) console.error("ERROR", err);
  });
};

export const readFile = async (filePath: string) => {
  const finalPath = path.join(getBasePath(), filePath);
  const dir = path.dirname(finalPath);
  try {
    if (!fs.existsSync(dir)) {
      return;
    }
    const data = fs.readFileSync(finalPath, "utf8");
    return data;
  } catch (error) {
    return;
  }
};

export const generateOTP = (length) => {
  // Declare a digits variable
  // which stores all digits
  let digits = "0123456789";
  let OTP = "";
  let len = digits.length;
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }

  return OTP;
};

export const createHash = (string) => {
  const hashPwd = crypto.createHash("sha1").update(string).digest("hex");
  return hashPwd;
};
