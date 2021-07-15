import { createECDH, createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";

function newECDH() {
  const ecdh = createECDH('secp256r1'); //secp521r1
  return [
    ecdh,
    ecdh.generateKeys()
  ];
}

function completeECDH(ecdh, key) {
  return ecdh.computeSecret(key);
}

// Get key
function getKey(K) {
  return createHash("sha256").update(String(K)).digest("hex").substr(0, 32);
}

// Encrypt
function encrypt(key, text) {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", key, iv);

  const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]).toString('base64');

  return {
    iv: iv.toString("hex"),
    content: encrypted,
  };
}

// Decrypt
function decrypt(content, key, iv) {
  const decipher = createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "hex")
  );

  var decrypted = decipher.update(content, 'base64', 'utf-8');
  decrypted += decipher.final();

  return decrypted;
}

export {newECDH, completeECDH, getKey, encrypt, decrypt}

/*
const [ecdha, A] = newECDH();
const [ecdhb, B] = newECDH();

const KA = completeECDH(ecdha, B);
const KB = completeECDH(ecdhb, A);

let key = getKey(KA);

const {iv, content} = encrypt(key, "Text");
const decrypted = decrypt(content, key, iv);
*/