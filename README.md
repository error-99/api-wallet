# 🧠 Vercel Wallet Generator API

This project provides a simple backend API to generate cryptocurrency wallets (BSC/Ethereum compatible) either by mnemonic phrases or private keys. It’s designed to deploy easily on Vercel with zero configuration.

---

## 🔧 Features

- Generate wallets using mnemonic or private key
- Supports custom derivation paths (default is MetaMask/BSC standard)
- Generate multiple wallets at once
- Download generated wallets as JSON file

---

## 🚀 API Endpoints

### 1. Generate Wallets

GET /api/generate?type=mnemonic|privateKey&count=1&path=m/44'/60'/0'/0

#### Parameters:

- `type`: `"mnemonic"` or `"privateKey"` (default: `mnemonic`)
- `count`: Number of wallets to generate (default: 1)
- `path`: Derivation path base for mnemonic wallets (default: `m/44'/60'/0'/0`)

#### Example:

/api/generate?type=mnemonic&count=3&path=m/44'/60'/0'/0

#### Sample Response:

```json
{
  "type": "mnemonic",
  "mnemonic": "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
  "pathBase": "m/44'/60'/0'/0",
  "wallets": [
    {
      "index": 0,
      "path": "m/44'/60'/0'/0/0",
      "address": "0xAbc123...",
      "privateKey": "0x..."
    },
    {
      "index": 1,
      "path": "m/44'/60'/0'/0/1",
      "address": "0xDef456...",
      "privateKey": "0x..."
    }
  ]
}


---

2. Download Wallets JSON

GET /api/download?data=<urlencoded-json-string>

Pass a URL-encoded JSON string from the generated wallet data. The API returns a downloadable .json file.

Example usage in frontend:

const jsonData = JSON.stringify(walletData);
const url = `/api/download?data=${encodeURIComponent(jsonData)}`;


---

📦 Deployment

1. Push this project to a GitHub repository.


2. Import and deploy it on Vercel.


3. Your APIs will be live immediately.




---

✅ Common Derivation Paths

Wallet	Path

MetaMask	m/44'/60'/0'/0
Trust Wallet	m/44'/60'/0'
Ledger	m/44'/60'/0'/0/0



---

⚠️ Security Notes

Do NOT expose generated private keys publicly without encryption.

This project is for educational/testing purposes.

For production, consider adding authentication and secure storage.



---
