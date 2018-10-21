import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import { stringify } from 'deterministic-json';
import getSigHash from './sigHash';
import { getSideChainPrivateKey, getSideChainPublicKey, getTransactionsNonce } from './storage';
import { stringToArray, arrayToString, jsonToArray } from './nacl';

export const createTransaction = async data => {
  const nonce = await getTransactionsNonce();
  let tx = {
    nonce,
    data,
  }

  const txString = stringify(tx);
  const message = jsonToArray(txString);
  const privateKey = stringToArray(await getSideChainPrivateKey());
  const publicKey = stringToArray(await getSideChainPublicKey());
  const sig = nacl.sign.detached(message, privateKey);
  tx.sig = arrayToString(sig);
  const verified = nacl.sign.detached.verify(message, sig, publicKey);
  return verified && tx;
}

//TODO add sendTransaction
