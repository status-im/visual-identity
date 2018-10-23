const web3 = require('web3');

function subtractAmounts(primary, secondary) {
  const { toBN, toWei } = web3.utils;
  const primaryWei = toWei(primary);
  const secondaryWei = toWei(secondary);
  return toBN(primaryWei).sub(toBN(secondaryWei)).toString();
}

function addAmounts(primary, secondary = 0) {
  const { toBN, toWei } = web3.utils;
  const primaryWei = toWei(primary);
  const secondaryWei = toWei(secondary);
  return toBN(primaryWei).add(toBN(secondaryWei)).toString();
}

module.exports = {
  subtractAmounts,
  addAmounts
}
