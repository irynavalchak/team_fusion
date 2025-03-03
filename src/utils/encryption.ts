import CryptoJS from 'crypto-js';

const SECRET_KEY = 'secret-key-12345%$#@!';

//function to replace dangerous characters before passing them in URL
const safeEncode = (str: string) => {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

//function to return to the original view before decoding
const safeDecode = (str: string) => {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return str;
};

export const encryptId = (id: number): string => {
  const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
  return safeEncode(encrypted);
};

export const decryptId = (encryptedId: string): number | null => {
  try {
    const decodedId = safeDecode(encryptedId);
    const bytes = CryptoJS.AES.decrypt(decodedId, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    const decryptedNumber = parseInt(decryptedString, 10);
    if (isNaN(decryptedNumber)) {
      console.error('Decrypted value is not a number:', decryptedString);
      return null;
    }
    return decryptedNumber;
  } catch (error) {
    console.error('Error decrypting ID:', error);
    return null;
  }
};
