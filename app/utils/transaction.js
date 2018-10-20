import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import { stringify } from 'deterministic-json';
import getSigHash from './sigHash';
import { getSideChainPrivateKey } from './storage';
import { stringToArray, arrayToString } from './nacl';

export const createTransaction = async data => {
  let tx = {
    //TODO add nonce
    data,
  }

  const sigHash = getSigHash(tx);
  const privateKey = stringToArray(await getSideChainPrivateKey());
  return arrayToString(nacl.sign(sigHash, privateKey));
}

//TODO add sendTransaction
