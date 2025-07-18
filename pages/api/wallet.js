import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { fromSeed } from 'bip32';
import { Wallet } from 'ethers';

export default function handler(req, res) {
  const { action, type = 'mnemonic', count = '1', path = "m/44'/60'/0'/0", data } = req.query;

  if (action === 'generate') {
    try {
      const n = parseInt(count);
      let wallets = [];

      if (type === 'mnemonic') {
        const mnemonic = generateMnemonic();
        const seed = mnemonicToSeedSync(mnemonic);
        const root = fromSeed(seed);

        for (let i = 0; i < n; i++) {
          const fullPath = `${path}/${i}`;
          const node = root.derivePath(fullPath);
          const wallet = new Wallet(node.privateKey);
          wallets.push({ index: i, path: fullPath, address: wallet.address, privateKey: wallet.privateKey });
        }

        return res.status(200).json({ type, mnemonic, pathBase: path, wallets });
      }

      // privateKey mode
      for (let i = 0; i < n; i++) {
        const wallet = Wallet.createRandom();
        wallets.push({ index: i, address: wallet.address, privateKey: wallet.privateKey });
      }

      return res.status(200).json({ type, wallets });

    } catch (err) {
      return res.status(500).json({ error: 'Failed to generate wallet', details: err.message });
    }
  }

  else if (action === 'download') {
    if (!data) return res.status(400).json({ error: 'Missing data parameter' });

    try {
      const content = JSON.stringify(JSON.parse(data), null, 2);
      res.setHeader('Content-Disposition', 'attachment; filename=wallets.json');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(content);
    } catch {
      res.status(400).json({ error: 'Invalid JSON data' });
    }
  }

  else {
    res.status(400).json({ error: 'Invalid or missing action parameter. Use ?action=generate or ?action=download' });
  }
}
