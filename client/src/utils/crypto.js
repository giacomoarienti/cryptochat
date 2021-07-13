import { createDiffieHellman, createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";

// Generate p, q, A
function newDF() {
  const alice = createDiffieHellman(1024);
  return [
    alice,
    {
      A: alice.generateKeys(),
      p: alice.getPrime(),
      g: alice.getGenerator(),
    },
  ];
}

// Complete DF with B
function completeDF(df, B) {
  return df.computeSecret(B);
}

// Calc shared secret K
function reciveDF({p, g, A}) {
  const bob = createDiffieHellman(p, g);
  return { B: bob.generateKeys(), K: bob.computeSecret(A) };
}

// Get key
function getKey(K) {
  return createHash("sha256").update(String(K)).digest("hex").substr(0, 32);
}

// Encrypt
function encrypt(key, text) {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", key, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

// Decrypt
function decrypt(content, key, iv) {
  const decipher = createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "hex")
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(content, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
}

export default {newDF, completeDF, reciveDF, getKey, encrypt, decrypt}

/*const [df, AKeys] = newDF();
const BKeys = reciveDF(AKeys);
const K = completeDF(df, BKeys.B);*/

/*const key = getKey(K);
const encrypted = encrypt(key, "Text");
const decrypted = decrypt(encrypted, key);
*/