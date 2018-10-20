import web3 from "Embark/web3";
import nacl from 'tweetnacl';
import { CryptoUtils } from 'loom-js';
import { arrayToString } from '../utils/nacl';

const { utils: { sha3  } } = web3;
const formatSignature = (address, msg, sig) => {
  return {
    address,
    msg,
    sig,
    version: "2"
  }
}
export const createKeyPair = async (nonce = 0) => {
  const account = await web3.eth.getCoinbase();
  const keyInfo = nacl.sign.keyPair();
  const publicKey = arrayToString(keyInfo.publicKey);
  const sidechainPrivateKey = arrayToString(keyInfo.secretKey);
  const publicKeyProof = await web3.eth.personal.sign(publicKey, account);
  const proofOfOwnership = formatSignature(account, publicKey, publicKeyProof);
  console.log(JSON.stringify(proofOfOwnership))
  return { publicKey, sidechainPrivateKey, proofOfOwnership };
}
