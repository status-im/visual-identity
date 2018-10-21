import naclUtil from 'tweetnacl-util';
import nacl from 'tweetnacl';

export const arrayToString = arr => naclUtil.encodeBase64(arr);
export const stringToArray = str => naclUtil.decodeBase64(str);
export const jsonToArray = json => naclUtil.decodeUTF8(json);
// https://github.com/dchest/tweetnacl-js/blob/gh-pages/app.js#L399
export const calculateHash = message => nacl.hash(naclUtil.decodeUTF8(message));
