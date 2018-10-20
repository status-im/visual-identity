import nacl from 'tweetnacl';
import { stringify } from 'deterministic-json';
import { cloneDeep } from 'lodash';
import { calculateHash, arrayToString } from './nacl';

// Object -> Uint8Array || String
export default function getSigHash (originalTx, asString = false) {
  const tx = cloneDeep(originalTx)

  // stringify tx deterministically (and convert buffers to strings)
  // then return sha256 hash of that
  let txString = stringify(tx)
  return asString ? arrayToString(calculateHash(txString)) : calculateHash(txString)
}
