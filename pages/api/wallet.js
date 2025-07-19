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
    const mnemonic = generateMnemonic();
    const seed = mnemonicToSeedSync(mnemonic);
    const root = fromSeed(seed);
    const wallets = [];

    for (let i = 0; i < walletCount; i++) {
      const child = root.derivePath(`${path}/${i}`);
      const wallet = new Wallet(child.privateKey);
      wallets.push({
        address: wallet.address,
        privateKey: wallet.privateKey,
      });
    }

    return res.status(200).json({ mnemonic, path, wallets });
  } else if (type === 'privateKey') {
    const wallets = [];

    for (let i = 0; i < walletCount; i++) {
      const wallet = Wallet.createRandom();
      wallets.push({
        address: wallet.address,
        privateKey: wallet.privateKey,
      });
    }

    return res.status(200).json({ wallets });
  } else {
    return res.status(400).json({ error: 'Invalid type. Use "mnemonic" or "privateKey".' });
  }
}
