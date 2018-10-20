import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import { stringify } from 'deterministic-json';
import { cloneDeep } from 'lodash';

// https://github.com/dchest/tweetnacl-js/blob/gh-pages/app.js#L399
const calculateHash = message => naclUtil.encodeBase64(nacl.hash(naclUtil.decodeUTF8(message)));

export default function getSigHash (originalTx) {
  const tx = cloneDeep(originalTx);

  // stringify tx deterministically (and convert buffers to strings)
  // then return sha256 hash of that
  let txString = stringify(tx)
  return calculateHash(txString)
}
