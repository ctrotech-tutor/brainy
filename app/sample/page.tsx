// app/sample/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Polytechnic {
  sNo: string;
  name: string;
  category: string;
  ownership: string;
  state: string;
}

export default function SamplePage() {
  const [polytechnics, setPolytechnics] = useState<Polytechnic[]>([]);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchPolytechnics() {
      setLoading(true);
      try {
        const res = await fetch("/api/polytechnics");
        const data = await res.json();

        if (data.error) setError(data.error);

        setPolytechnics(data.polytechnics || []);
        // For display: extract the token if returned from API
        // We'll modify the API to return token as well
        setCsrfToken(data.csrfToken || "N/A");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPolytechnics();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-purple-700">NBTE Polytechnics</h1>

      {loading && <p className="text-gray-500">Loading polytechnics...</p>}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <div className="mb-6">
        <h2 className="font-semibold text-lg">CSRF Token (for display only)</h2>
        <p className="break-all text-sm text-gray-700 bg-gray-100 p-2 rounded">{csrfToken}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-4 py-2 border">S/No</th>
              <th className="px-4 py-2 border">Institution Name</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Ownership</th>
              <th className="px-4 py-2 border">State</th>
            </tr>
          </thead>
          <tbody>
            {polytechnics.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No polytechnics found
                </td>
              </tr>
            ) : (
              polytechnics.map((p) => (
                <tr key={p.sNo} className="hover:bg-purple-50">
                  <td className="px-4 py-2 border">{p.sNo}</td>
                  <td className="px-4 py-2 border">{p.name}</td>
                  <td className="px-4 py-2 border">{p.category}</td>
                  <td className="px-4 py-2 border">{p.ownership}</td>
                  <td className="px-4 py-2 border">{p.state}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
