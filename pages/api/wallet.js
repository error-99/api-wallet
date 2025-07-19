import { mnemonicToSeedSync, generateMnemonic } from 'bip39';
import { fromSeed } from 'bip32';
import { Wallet } from 'ethers';

export default async function handler(req, res) {
  const { count = 1, type = 'mnemonic', path = "m/44'/60'/0'/0", action, data } = req.query;
  const walletCount = Math.min(Number(count), 50);

  if (action === 'download' && data) {
    res.setHeader('Content-Disposition', 'attachment; filename=wallets.json');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(decodeURIComponent(data));
  }

  if (type === 'mnemonic') {
    try {
      const mnemonic = generateMnemonic();
      const seed = mnemonicToSeedSync(mnemonic);
      const root = fromSeed(seed);
      const wallets = [];

      for (let i = 0; i < walletCount; i++) {
        const fullPath = `${path}/${i}`; // e.g., m/44'/60'/0'/0/0
        const child = root.derivePath(fullPath);

        if (!child.privateKey) {
          return res.status(500).json({ error: `Missing private key at path ${fullPath}` });
        }

        const privateKeyHex = '0x' + child.privateKey.toString('hex');
        const wallet = new Wallet(privateKeyHex);

        wallets.push({
          address: wallet.address,
          privateKey: wallet.privateKey,
        });
      }

      return res.status(200).json({ mnemonic, path, wallets });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (type === 'privateKey') {
    const wallets = [];

    for (let i = 0; i < walletCount; i++) {
      const wallet = Wallet.createRandom();
      wallets.push({
        address: wallet.address,
        privateKey: wallet.privateKey,
      });
    }

    return res.status(200).json({ wallets });
  }

  return res.status(400).json({ error: 'Invalid type. Use "mnemonic" or "privateKey".' });
}
