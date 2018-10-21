const {
  addHexPrefix,
  ecsign,
  ecrecover,
  sha3,
  hashPersonalMessage,
  toBuffer,
  pubToAddress
} = require('ethereumjs-util');
const { stringify } = require('deterministic-json');
const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');

const arrayToString = arr => naclUtil.encodeBase64(arr);
const stringToArray = str => naclUtil.decodeBase64(str);
const jsonToArray = json => naclUtil.decodeUTF8(json);

function stripHexPrefix(value) {
  return value.replace('0x', '');
}

function stripHexPrefixAndLower(value) {
  return stripHexPrefix(value).toLowerCase();
}

function verifySignedMessage({ address, msg, sig, version }) {
  const sigb = new Buffer(stripHexPrefixAndLower(sig), 'hex');
  if (sigb.length !== 65) {
    return false;
  }
  //TODO: explain what's going on here
  sigb[64] = sigb[64] === 0 || sigb[64] === 1 ? sigb[64] + 27 : sigb[64];
  const hash = version === '2' ? hashPersonalMessage(toBuffer(msg)) : sha3(msg);
  const pubKey = ecrecover(hash, sigb[64], sigb.slice(0, 32), sigb.slice(32, 64));

  return stripHexPrefixAndLower(address) === pubToAddress(pubKey).toString('hex');
}

function verifySignedTx(tx) {
  const { nonce, data, publicKey, sig } = tx;
  const msgArr = jsonToArray(stringify({ nonce, data, publicKey }));
  const sigArr = stringToArray(sig);
  const publicKeyArr = stringToArray(publicKey);
  const verified = nacl.sign.detached.verify(msgArr, sigArr, publicKeyArr);
  return verified
}

module.exports = {
  verifySignedMessage,
  verifySignedTx
}
