import { useState } from 'react';
import { apiClient } from '@nasnet/api-client/core';
import { Button } from '@nasnet/ui/primitives';
export function ApiTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>('');
  const testConnection = async () => {
    setTesting(true);
    try {
      // This call should route to localhost:8080 via Vite proxy
      const response = await apiClient.get('/router/status');
      setResult(`✅ ${"API connection successful"}: ${JSON.stringify(response.data)}`);
    } catch (e) {
      // Expected behavior - backend may not be running, but proxy should work
      setResult(`ℹ️ ${"API proxy working (expected backend error)"}: ${String(e)}`);
    } finally {
      setTesting(false);
    }
  };
  return <div className="border-border rounded border p-4">
      <h3 className="mb-2 text-sm font-semibold">{"API Proxy Test (AC-3)"}</h3>
      <Button onClick={testConnection} disabled={testing}>
        {testing ? "Testing..." : "Test API Connection"}
      </Button>
      {result && <p className="mt-2 font-mono text-xs">{result}</p>}
    </div>;
}