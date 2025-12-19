import crypto from "crypto";

const SECRET = process.env.OTP_SECRET || "fallback-secret-key-change-me";

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createOtpHash = (email: string, code: string, expiry: number) => {
  const data = `${email}.${code}.${expiry}`;
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
};

export const verifyOtpHash = (email: string, code: string, expiry: number, hash: string) => {
  const newHash = createOtpHash(email, code, expiry);
  return newHash === hash;
};
