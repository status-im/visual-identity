import Dexie from 'dexie';

const db = new Dexie('visual-identity');
db.version(1).stores({
  sidechainKeyData: `++id,publicKey,privateKey,proofOfOwnership`,
  transactionsNonce: `nonce`
});

db.on("populate", function() {
  // Init DB with initial values:
  db.transactionsNonce.add({ nonce: 1 });
});

export const storeKeyData =  async data => {
  const { publicKey, sidechainPrivateKey, proofOfOwnership } = data;
  const id = await db.sidechainKeyData.add({
    publicKey,
    privateKey: sidechainPrivateKey,
    proofOfOwnership
  });
  return id;
}

export const getLatestKeyData = async () => {
  return await db.sidechainKeyData.orderBy(":id").last();
}

export const getSideChainPrivateKey = async () => {
  const data = await getLatestKeyData();
  return data['privateKey']
}

export const getSideChainPublicKey = async () => {
  const data = await getLatestKeyData();
  return data['publicKey']
}

export const getLatestKeyNonce = async () => {
  const data = await getLatestKeyData();
  return data['id'];
}

export const getTransactionsNonce = async () => {
  return await db.transactionsNonce.get(1);
}

export const incrementTransactionsNonce = async () => {
  db.transactionsNonce.toCollection().modify(function(record) {
    record.nonce += 1;
  });
}
