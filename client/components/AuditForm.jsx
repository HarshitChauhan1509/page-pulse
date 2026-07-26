"use client";

import { useState } from "react";
import { auditWebsite } from "../services/api";

export default function AuditForm({ setResult, setLoading }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    try {
      setLoading(true);

      const data = await auditWebsite(url);

      setResult(data);
    } catch (err) {
      setResult(null);

      if (err.response?.data?.error?.message) {
        setError(err.response.data.error.message);
      } else {
        setError("Unable to audit website.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 bg-white rounded-xl shadow-lg p-8"
    >
      <label className="block mb-3 text-lg font-semibold">
        Website URL
      </label>

      <input
        type="text"
        placeholder="https://openai.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && (
        <p className="text-red-600 mt-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition"
      >
        Audit Website
      </button>
    </form>
  );
}