import Dexie from 'dexie';

const db = new Dexie('visual-identity');
db.version(1).stores({
  sidechainKeyData: `++id,publicKey,privateKey,proofOfOwnership`
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

export const getLatestKeyNonce = async () => {
  const data = await getLatestKeyData();
  return data['id'];
}
