const crypto = require("crypto");

// Function to generate a random key
exports.generateKey = () => {
  return crypto.randomBytes(32); // 256 bits key for AES-256
};

// Function to encrypt the plain text using AES
exports.encrypt = (plainText, key) => {
  const cipher = crypto.createCipher("aes-256-cbc", key);
  let encryptedText = cipher.update(plainText, "utf-8", "hex");
  encryptedText += cipher.final("hex");
  return encryptedText;
};

// Function to decrypt the encrypted text using AES
exports.decrypt = (encryptedText, key) => {
  console.log(encryptedText);
  try {
    const decipher = crypto.createDecipher("aes-256-cbc", key);
    let decryptedText = decipher.update(encryptedText, "hex", "utf-8");
    decryptedText += decipher.final("utf-8");
    return decryptedText;
  } catch (error) {
    console.error("Decryption error:", error.message);
    throw new Error("Error decrypting the message");
  }
};

// Example usage
// const textToEncrypt = "Hello, World!";
// const key = generateKey();

// const encryptedText = encrypt(textToEncrypt, key);
// console.log("Encrypted Text:", encryptedText);

// const decryptedText = decrypt(encryptedText, key);
// console.log("Decrypted Text:", decryptedText);
