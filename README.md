: '
🔐 Ethereum Wallet Generator API
--------------------------------

This Node.js API endpoint provides a simple and secure way to generate Ethereum wallets based on
mnemonic phrases or random private keys, along with support for downloading generated wallets as JSON.

📦 Features
-----------
✅ Generate Ethereum wallets using BIP-39 mnemonics  
🔑 Support for random private key-based wallets  
📂 Download wallets as a JSON file  
🧭 Custom HD derivation path support (default: m/44'/60'/0'/0)  
🔒 Built using ethers, bip39, and bip32  

🚀 How to Use
-------------
Send a GET request to the endpoint with query parameters.

✅ Example Requests:

1. Generate 5 wallets using mnemonics:
   curl "http://localhost:3000/api/wallet-generator?count=5&type=mnemonic"

2. Generate 3 wallets using random private keys:
   curl "http://localhost:3000/api/wallet-generator?count=3&type=privateKey"

3. Download previously generated wallets:
   curl "http://localhost:3000/api/wallet-generator?action=download&data=<encoded_json_data>"

📌 Tip:
Use encodeURIComponent(JSON.stringify(walletData)) in your frontend to encode the data.

🔧 Query Parameters
-------------------
| Name     | Type   | Default           | Description                                                  |
|----------|--------|-------------------|--------------------------------------------------------------|
| count    | Number | 1                 | Number of wallets to generate (max: 50)                      |
| type     | String | "mnemonic"        | "mnemonic" or "privateKey"                                   |
| path     | String | "m/44'/60'/0'/0"  | HD derivation path for mnemonic wallets                      |
| action   | String | —                 | Use "download" to trigger JSON download                      |
| data     | String | —                 | JSON string (URL-encoded) to download as a file              |

📤 Response Format
-------------------

Mnemonic Wallets:
[
  {
    "mnemonic": "urge stay tomato ...",
    "path": "m/44'/60'/0'/0",
    "evm": "0xabc123...def"
  }
]

Private Key Wallets:
{
  "wallets": [
    {
      "address": "0xabc123...def",
      "privateKey": "0x1234abcd..."
    }
  ]
}

⚠️ Error Responses
-------------------
{ "error": "Invalid type. Use \"mnemonic\" or \"privateKey\"." }

{ "error": "Could not derive private key at m/44'/60'/0'/0" }

{ "error": "Internal Server Error" }

🛠️ Tech Stack
--------------
- ethers.js
- bip39
- bip32

🔐 Security Notice
-------------------
Always treat mnemonics and private keys as highly sensitive information.  
Do not expose them in insecure environments.

📄 License
----------
MIT © 2025
'
