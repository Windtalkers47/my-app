import CryptoJS from 'crypto-js';

export const encryptPassword = (password: string): string => {
  const SECRET_KEY = process.env.REACT_APP_CRYPTO_SECRET_KEY!;
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};
