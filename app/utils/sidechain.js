import web3 from "Embark/web3"
import { CryptoUtils } from 'loom-js';

export const createKeyPair = async (nonce = 0) => {
  console.log({web3})
  const KEY_PHRASE = `THIS WILL CREATE YOUR PRIVATE KEY FOR THE SIDECHAIN ${nonce}`;
  const account = await web3.eth.getCoinbase();
  const sidechainPrivateKey = await web3.eth.personal.sign(web3.utils.fromUtf8(KEY_PHRASE), account);
  const uint8array = new TextEncoder().encode(sidechainPrivateKey).slice(0,64);
  const publicKeyArray = CryptoUtils.publicKeyFromPrivateKey(uint8array);
  const publicKey = CryptoUtils.bytesToHex(publicKeyArray);
  return { publicKey, sidechainPrivateKey };
}
