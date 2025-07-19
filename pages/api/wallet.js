import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { fromSeed } from 'bip32';
import { Wallet } from 'ethers';

export default async function handler(req, res) {
  try {
    const {
      count = '1',
      type = 'mnemonic',
      path = "m/44'/60'/0'/0",
      action,
      data,
    } = req.query;

    const walletCount = Math.min(parseInt(count, 10) || 1, 50);

    // Download action for JSON data
    if (action === 'download' && data) {
      res.setHeader('Content-Disposition', 'attachment; filename=wallets.json');
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(decodeURIComponent(data));
    }

    if (type === 'mnemonic') {
      const results = [];

      for (let i = 0; i < walletCount; i++) {
        const mnemonic = generateMnemonic();
        const seed = mnemonicToSeedSync(mnemonic);
        const root = fromSeed(seed);

        const fullPath = `${path}/0`; // always first address
        const child = root.derivePath(fullPath);

        if (!child.privateKey) {
          return res.status(500).json({ error: `Could not derive private key at ${fullPath}` });
        }

        const privateKeyHex = '0x' + child.privateKey.toString('hex');
        const wallet = new Wallet(privateKeyHex);

        results.push({
          mnemonic,
          path,
          evm: wallet.address,
        });
      }

      return res.status(200).json(results);
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
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
