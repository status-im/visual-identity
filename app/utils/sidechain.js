import web3 from "Embark/web3"
import { CryptoUtils } from 'loom-js';

const formatSignature = (address, msg, sig) => {
  return {
    address,
    msg,
    sig,
    version: "2"
  }
}
export const createKeyPair = async (nonce = 0) => {
  const KEY_PHRASE = `YOU ARE GENERATING YOUR SIDECHAIN KEY USING A NONCE OF: ${nonce},
YOU WILL NEED TO SIGN ONE MORE MESSAGE AFTER THIS TO GENERATE YOUR PROOF OF OWNERSHIP OF THE NEW PUBLIC KEY`;
  const account = await web3.eth.getCoinbase();
  const sidechainPrivateKey = await web3.eth.personal.sign(web3.utils.fromUtf8(KEY_PHRASE), account);
  const uint8array = new TextEncoder().encode(sidechainPrivateKey).slice(0,64);
  const publicKeyArray = CryptoUtils.publicKeyFromPrivateKey(uint8array);
  const publicKey = CryptoUtils.bytesToHex(publicKeyArray);
  const publicKeyProof = await web3.eth.personal.sign(web3.utils.fromUtf8(publicKey), account);
  const proofOfOwnership = formatSignature(account, publicKey, publicKeyProof);
  console.log(JSON.stringify(proofOfOwnership))
  //TODO save info to storage
  return { publicKey, sidechainPrivateKey, proofOfOwnership };
}
