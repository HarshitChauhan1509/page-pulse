"use client";

import { useState } from "react";

import AuditForm from "../components/AuditForm";
import AuditCard from "../components/AuditCard";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-center">
          Page Pulse
        </h1>

        <p className="text-center text-gray-500 mt-4 text-lg">
          Analyze any webpage in seconds
        </p>

        <AuditForm
          setLoading={setLoading}
          setResult={setResult}
        />

        {loading && <Loader />}

        {!loading && result && (
          <AuditCard result={result} />
        )}
      </div>

      <Footer />
    </main>
  );
}
