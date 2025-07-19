import { useState } from 'react';

export default function Home() {
  const [type, setType] = useState('mnemonic');
  const [count, setCount] = useState(1);
  const [path, setPath] = useState("m/44'/60'/0'/0");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    const params = new URLSearchParams();
    params.set('type', type);
    params.set('count', count);

    if (type === 'mnemonic') {
      params.set('path', path);
    }

    const res = await fetch(`/api/wallet?${params.toString()}`);
    const data = await res.json();

    setResult(data);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>🪙 Wallet Generator</h1>

      <label>
        <strong>Type:</strong><br />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="mnemonic">Mnemonic</option>
          <option value="privateKey">Private Key</option>
        </select>
      </label>

      <br /><br />

      {type === 'mnemonic' && (
        <>
          <label>
            <strong>Derivation Path:</strong><br />
            <input type="text" value={path} onChange={(e) => setPath(e.target.value)} style={{ width: '100%' }} />
          </label>
          <br /><br />
        </>
      )}

      <label>
        <strong>Wallet Count:</strong><br />
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          min="1"
          max="50"
          style={{ width: '100%' }}
        />
      </label>

      <br /><br />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Wallets'}
      </button>

      {result && (
        <>
          <h2>Result</h2>
          <pre style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
