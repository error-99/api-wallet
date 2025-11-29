'use client'; // <--- THIS IS VERY IMPORTANT FOR NEXT.JS APP ROUTER

import { useState } from 'react';

export default function Home() {
  const [type, setType] = useState('mnemonic');
  const [count, setCount] = useState(1);
  const [path, setPath] = useState("m/44'/60'/0'/0");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const params = new URLSearchParams();
      params.set('type', type);
      params.set('count', count);

      if (type === 'mnemonic') {
        params.set('path', path);
      }

      const res = await fetch(`/api/wallet?${params.toString()}`);
      const data = await res.json();

      setResult(data);
    } catch (error) {
      console.error("Failed to generate wallets", error);
      alert("Error connecting to API");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
            🪙
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">
            Wallet Generator
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Generate EVM compatible wallets instantly.
          </p>
        </div>

        {/* Controls */}
        <div className="mt-8 space-y-6">
          
          {/* Wallet Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-700">
              Generation Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
            >
              <option value="mnemonic">Mnemonic Phrase (Seed)</option>
              <option value="privateKey">Private Key</option>
            </select>
          </div>

          {/* Derivation Path (Conditional) */}
          {type === 'mnemonic' && (
            <div>
              <label htmlFor="path" className="block text-sm font-medium text-slate-700">
                Derivation Path
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="path"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                  placeholder="m/44'/60'/0'/0"
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">Standard Ethereum path: m/44'/60'/0'/0</p>
            </div>
          )}

          {/* Wallet Count */}
          <div>
            <label htmlFor="count" className="block text-sm font-medium text-slate-700">
              Number of Wallets
            </label>
            <input
              type="number"
              id="count"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="50"
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white 
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200'}`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Wallets'
            )}
          </button>
        </div>

        {/* Results Area */}
        {result && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg leading-6 font-medium text-slate-900">Result</h3>
              <button 
                onClick={copyToClipboard}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
            </div>
            <div className="bg-slate-900 rounded-lg overflow-hidden shadow-inner ring-1 ring-black ring-opacity-5">
              <div className="max-h-64 overflow-y-auto p-4 custom-scrollbar">
                <pre className="text-xs sm:text-sm text-green-400 font-mono whitespace-pre-wrap break-all">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
